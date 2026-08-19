import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    const { projectId, metadata } = rawData;
    
    if (!projectId || !metadata) {
      return NextResponse.json({ error: 'Project ID and metadata required' }, { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Using service role key if available for secure backend updates, fallback to anon key
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Unconditionally update the project with the detected metadata
    const { error } = await supabase
      .from('projects')
      .update({
        site_url: metadata.siteUrl,
        name: metadata.siteName || 'My Application'
      })
      .eq('id', projectId);

    if (error) {
      console.error('Failed to update project:', error);
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Init API error:', error);
    return NextResponse.json({ error: 'Failed to init' }, { status: 500, headers: corsHeaders });
  }
}
