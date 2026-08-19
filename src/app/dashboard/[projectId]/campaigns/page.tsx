'use client';

import { useState, useEffect, use } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

type Broadcast = {
  id: string;
  title: string;
  body: string;
  status: 'sent' | 'scheduled' | 'failed';
  sent_count: number;
  click_count: number;
  scheduled_for: string | null;
  created_at: string;
};

export default function CampaignsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBroadcasts = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Failed to load campaigns.');
        console.error(error);
      } else {
        setBroadcasts(data || []);
      }
      setLoading(false);
    };

    fetchBroadcasts();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BAAA8]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Campaign History</h1>
          <p className="text-[#a1a1aa] text-sm">Analyze your past broadcasts and upcoming scheduled pushes.</p>
        </div>
        <Link 
          href={`/dashboard/${projectId}`}
          className="bg-[#8BAAA8] text-black hover:bg-[#729290] font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 w-fit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Broadcast
        </Link>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : broadcasts.length === 0 ? (
        <div className="bg-bg-card border border-border-main rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-bg-input rounded-full flex items-center justify-center mb-4 border border-border-main">
            <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Campaigns Yet</h3>
          <p className="text-zinc-400 text-sm max-w-md">You haven't sent or scheduled any push notifications yet. Head over to the workspace to create your first broadcast!</p>
        </div>
      ) : (
        <div className="bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-input/50 text-zinc-400 font-medium border-b border-border-main">
                <tr>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Sent To</th>
                  <th className="px-6 py-4">Clicks</th>
                  <th className="px-6 py-4">CTR</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {broadcasts.map((broadcast) => {
                  const ctr = broadcast.sent_count > 0 
                    ? ((broadcast.click_count / broadcast.sent_count) * 100).toFixed(1) 
                    : '0.0';
                  
                  return (
                    <tr key={broadcast.id} className="hover:bg-bg-input/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium truncate max-w-[200px]">{broadcast.title}</span>
                          <span className="text-zinc-500 text-xs truncate max-w-[200px]">{broadcast.body}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {broadcast.status === 'sent' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Sent
                          </span>
                        )}
                        {broadcast.status === 'scheduled' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Scheduled
                          </span>
                        )}
                        {broadcast.status === 'failed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{broadcast.sent_count}</td>
                      <td className="px-6 py-4 text-white font-medium">{broadcast.click_count}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${Number(ctr) > 5 ? 'text-emerald-400' : 'text-[#8BAAA8]'}`}>
                          {ctr}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-zinc-400 text-xs">
                        {new Date(broadcast.scheduled_for || broadcast.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
