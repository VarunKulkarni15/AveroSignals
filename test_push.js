require('dotenv').config({ path: '.env.local' });
const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function testPush() {
  const { data, error } = await supabase.from('subscriptions').select('*');
  if (error) {
    console.error('Supabase Error:', error);
    return;
  }
  
  if (data.length === 0) {
    console.error('No subscriptions found in DB.');
    return;
  }

  console.log(`Found ${data.length} subscriptions. Trying to push to the first one...`);
  const sub = data[0].subscription_data;

  try {
    const res = await webpush.sendNotification(sub, JSON.stringify({
      title: 'Test',
      body: 'Test body',
      averoUrl: 'http://localhost'
    }));
    console.log('Push Success:', res.statusCode);
  } catch (err) {
    console.error('Push Failed:', err);
  }
}

testPush();
