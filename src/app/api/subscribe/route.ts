import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json({ metadata: null }, { headers: corsHeaders });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('metadata')
      .eq('project_id', projectId)
      .limit(1);
      
    if (data && data.length > 0 && data[0].metadata) {
      return NextResponse.json({ metadata: data[0].metadata }, { headers: corsHeaders });
    }
    return NextResponse.json({ metadata: null }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    let subscription = rawData.subscription ? rawData.subscription : rawData;
    let projectId = rawData.projectId;
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400, headers: corsHeaders });
    }

    let metadata = rawData.metadata ? { 
      siteName: rawData.metadata.siteName || 'Avero Signals User', 
      siteIcon: rawData.metadata.siteIcon || '/icon.png',
      siteUrl: rawData.metadata.siteUrl || 'localhost',
      siteDescription: rawData.metadata.siteDescription || '',
      os: rawData.metadata.os || 'Unknown',
      browser: rawData.metadata.browser || 'Unknown',
      timezone: rawData.metadata.timezone || 'UTC'
    } : { siteName: 'Avero Signals User', siteIcon: '/icon.png' };

    const { error } = await supabase.from('subscriptions').upsert({
      endpoint: subscription.endpoint,
      subscription_data: subscription,
      metadata: metadata,
      project_id: projectId
    }, { onConflict: 'endpoint' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500, headers: corsHeaders });
  }
}
