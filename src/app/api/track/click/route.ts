import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { broadcastId } = await req.json();

    if (!broadcastId) {
      return NextResponse.json({ error: 'Missing broadcast ID' }, { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Call an RPC function or just read-and-update (since this is low stakes analytics, a race condition is fine for an MVP)
    // For exact accuracy, a Supabase RPC function `increment_click(broadcast_id)` is better.
    const { data: broadcast } = await supabase
      .from('broadcasts')
      .select('click_count')
      .eq('id', broadcastId)
      .single();

    if (broadcast) {
      await supabase
        .from('broadcasts')
        .update({ click_count: (broadcast.click_count || 0) + 1 })
        .eq('id', broadcastId);
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500, headers: corsHeaders });
  }
}
