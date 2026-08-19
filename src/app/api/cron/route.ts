import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// This endpoint is designed to be called by Vercel Cron every minute
export async function GET(req: Request) {
  // Optional: Verify the request is from Vercel Cron using authorization headers
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Use the Service Role Key because this is an automated background task with no active user session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date().toISOString();

    // Find all scheduled broadcasts where scheduled_for is in the past and status is 'scheduled'
    const { data: pendingBroadcasts, error: fetchError } = await supabase
      .from('broadcasts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now);

    if (fetchError) {
      console.error('Error fetching pending broadcasts:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch broadcasts' }, { status: 500 });
    }

    if (!pendingBroadcasts || pendingBroadcasts.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending broadcasts' });
    }

    let totalSent = 0;

    for (const broadcast of pendingBroadcasts) {
      const { id, project_id, title, body, image, target_os, target_region } = broadcast;

      // Fetch subscriptions for this project
      const { data: dataSubs, error: subsError } = await supabase
        .from('subscriptions')
        .select('subscription_data, metadata')
        .eq('project_id', project_id);

      if (subsError || !dataSubs) {
        await supabase.from('broadcasts').update({ status: 'failed' }).eq('id', id);
        continue;
      }

      let subscriptions = dataSubs;

      // Apply segment filters
      if (target_os && target_os !== 'All') {
        subscriptions = subscriptions.filter(sub => sub.metadata?.os === target_os);
      }
      if (target_region && target_region !== 'All') {
        subscriptions = subscriptions.filter(sub => sub.metadata?.timezone?.includes(target_region));
      }

      if (subscriptions.length === 0) {
        await supabase.from('broadcasts').update({ status: 'failed' }).eq('id', id);
        continue;
      }

      const payload = JSON.stringify({
        title: title,
        body: body,
        image: image || undefined,
        broadcastId: id // Click tracking
      });

      const webPushSubs = subscriptions.map(sub => sub.subscription_data);

      let sentCount = 0;
      for (const sub of webPushSubs) {
        try {
          await webpush.sendNotification(sub, payload);
          sentCount++;
        } catch (error) {
          console.error('Error sending to subscriber from cron:', error);
        }
      }

      // Update broadcast status
      await supabase.from('broadcasts').update({ 
        status: 'sent', 
        sent_count: sentCount 
      }).eq('id', id);

      // Increment project's broadcast count
      const { data: project } = await supabase.from('projects').select('broadcast_count').eq('id', project_id).single();
      if (project) {
        await supabase.from('projects').update({ broadcast_count: (project.broadcast_count || 0) + 1 }).eq('id', project_id);
      }

      totalSent += sentCount;
    }

    return NextResponse.json({ success: true, processed: pendingBroadcasts.length, totalSent });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
