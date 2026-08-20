import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@/utils/supabase/server';

webpush.setVapidDetails(
  'mailto:admin@averosignals.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bodyData = await req.json();
    const { title, body, image, targetOS, targetRegion, scheduleTime, projectId } = bodyData;
    
    // Get host for Service Worker tracking
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const averoUrl = `${protocol}://${host}`;
  
    if (!projectId || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch project details and verify quota
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('user_id, broadcast_count, broadcast_quota')
      .eq('id', projectId)
      .single();
      
    if (projError || !project) {
      console.error("Project fetch error:", projError);
      return NextResponse.json({ error: `Project error: ${projError?.message || 'Not found'}` }, { status: 404 });
    }

    const currentCount = project.broadcast_count || 0;
    const currentQuota = project.broadcast_quota || 10000;

    if (currentCount >= currentQuota) {
      return NextResponse.json({ error: 'Broadcast quota exceeded. Please unlock more quota or upgrade.' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('subscription_data, metadata')
      .eq('project_id', projectId);
    
    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: 'No subscriptions found' }, { status: 400 });
    }

    let subscriptions = data;

    if (targetOS && targetOS !== 'All') {
      subscriptions = subscriptions.filter(sub => sub.metadata?.os === targetOS);
    }

    if (targetRegion && targetRegion !== 'All') {
      subscriptions = subscriptions.filter(sub => sub.metadata?.timezone?.includes(targetRegion));
    }

    if (subscriptions.length === 0) {
      return NextResponse.json({ error: 'No subscribers found for this segment.' }, { status: 400 });
    }

    // Save the broadcast to the database
    let broadcastId = null;
    const { data: bData, error: bError } = await supabase.from('broadcasts').insert({
      project_id: projectId,
      title: title || 'New Notification',
      body: body || 'You have a new update!',
      image: image || null,
      target_os: targetOS || 'All',
      target_region: targetRegion || 'All',
      status: scheduleTime ? 'scheduled' : 'sent',
      scheduled_for: scheduleTime ? new Date(scheduleTime).toISOString() : null
    }).select('id').single();

    if (bData) {
      broadcastId = bData.id;
    }

    if (scheduleTime) {
      const targetTime = new Date(scheduleTime).getTime();
      const delay = targetTime - Date.now();
      
      // We will rely on Vercel cron to pick it up later if delay is > 1 min
      // But if it's very soon (e.g. < 5 mins), we could just let the cron do it
      // For reliable scheduling, we should entirely rely on cron, but we return a success response immediately.
      return NextResponse.json({ sent: 'Scheduled', message: `Scheduled to send to ${subscriptions.length} users.`, broadcastId });
    }

    const payload = JSON.stringify({
      title: title || 'New Notification',
      body: body || 'You have a new update!',
      image: image || undefined,
      broadcastId: broadcastId,
      averoUrl: averoUrl
    });

    const webPushSubs = subscriptions.map(sub => sub.subscription_data);

    const sendPush = async () => {
      let sentCount = 0;
      for (const sub of webPushSubs) {
        try {
          await webpush.sendNotification(sub, payload);
          sentCount++;
        } catch (error) {
          console.error('Error sending to subscriber:', error);
        }
      }
      return sentCount;
    };

    const sent = await sendPush();

    // Increment broadcast count in the project table
    await supabase.from('projects').update({ broadcast_count: (project.broadcast_count || 0) + 1 }).eq('id', projectId);
    
    // Update the sent count on the broadcast
    if (broadcastId) {
      await supabase.from('broadcasts').update({ sent_count: sent }).eq('id', broadcastId);
    }
    
    return NextResponse.json({ success: true, sent, broadcastId });
  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: 'Failed to broadcast' }, { status: 500 });
  }
}
