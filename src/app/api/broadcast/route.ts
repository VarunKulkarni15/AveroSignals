import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@/utils/supabase/server';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
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

    const { title, body, image, targetOS, scheduleTime, projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
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

    if (subscriptions.length === 0) {
      return NextResponse.json({ error: 'No subscribers found for this segment.' }, { status: 400 });
    }

    const payload = JSON.stringify({
      title: title || 'New Notification',
      body: body || 'You have a new update!',
      image: image || undefined
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

    if (scheduleTime) {
      const targetTime = new Date(scheduleTime).getTime();
      const delay = targetTime - Date.now();
      if (delay > 0) {
        setTimeout(() => sendPush(), delay);
        return NextResponse.json({ sent: 'Scheduled', message: `Scheduled to send to ${subscriptions.length} users.` });
      }
    }

    const sent = await sendPush();
    
    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: 'Failed to broadcast' }, { status: 500 });
  }
}
