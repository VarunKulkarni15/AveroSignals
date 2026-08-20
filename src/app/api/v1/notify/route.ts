import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

webpush.setVapidDetails(
  'mailto:admin@averosignals.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// We need a service_role client because this is a server-to-server API request.
// RLS for projects is restricted to authenticated users, but API requests come without a logged-in user.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback if service role not set
);

export async function POST(req: Request) {
  try {
    // 1. Authenticate via Bearer Token (Secret API Key)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }
    const secretApiKey = authHeader.split(' ')[1];

    // 2. Find the project with this API Key
    const { data: project, error: projError } = await supabaseAdmin
      .from('projects')
      .select('id, user_id, broadcast_count, broadcast_quota')
      .eq('secret_api_key', secretApiKey)
      .single();

    if (projError || !project) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
    }

    const currentCount = project.broadcast_count || 0;
    const currentQuota = project.broadcast_quota || 10000;

    if (currentCount >= currentQuota) {
      return NextResponse.json({ error: 'Broadcast quota exceeded. Please upgrade your plan or unlock more quota.' }, { status: 403 });
    }

    const projectId = project.id;

    // 3. Parse Request Body
    const { title, body, image, targetOS, targetRegion } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    // 4. Fetch Subscribers for this Project
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('subscription_data, metadata')
      .eq('project_id', projectId);
    
    if (subError || !subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: 'No subscribers found' }, { status: 400 });
    }

    let filteredSubs = subscriptions;

    if (targetOS && targetOS !== 'All') {
      filteredSubs = filteredSubs.filter(sub => sub.metadata?.os === targetOS);
    }

    if (targetRegion && targetRegion !== 'All') {
      filteredSubs = filteredSubs.filter(sub => sub.metadata?.timezone?.includes(targetRegion));
    }

    if (filteredSubs.length === 0) {
      return NextResponse.json({ error: 'No subscribers found for the specified targeting.' }, { status: 400 });
    }

    const payload = JSON.stringify({ title, body, image });
    const webPushSubs = filteredSubs.map(sub => sub.subscription_data);

    let sentCount = 0;
    for (const sub of webPushSubs) {
      try {
        await webpush.sendNotification(sub, payload);
        sentCount++;
      } catch (error) {
        console.error('Avero Signals API Error sending to subscriber:', error);
      }
    }

    // 5. Update Broadcast Count
    await supabaseAdmin
      .from('projects')
      .update({ broadcast_count: (project.broadcast_count || 0) + 1 })
      .eq('id', projectId);
    
    return NextResponse.json({ success: true, sent: sentCount });
  } catch (error: any) {
    console.error('Avero Signals API Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
