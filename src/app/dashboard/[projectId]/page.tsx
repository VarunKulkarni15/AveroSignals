'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import NotificationPreview from '@/components/NotificationPreview';
import { updateProjectSettings, deleteProject } from './actions';

export default function Dashboard({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [appName, setAppName] = useState('My Application');
  const [siteUrl, setSiteUrl] = useState('');
  const [broadcastCount, setBroadcastCount] = useState<number>(0);
  const [icon, setIcon] = useState('https://img.icons8.com/fluency/48/bell.png');
  const [previewOS, setPreviewOS] = useState<'windows' | 'mac' | 'android' | 'ios'>('windows');
  
  const [targetOS, setTargetOS] = useState('All');
  const [targetRegion, setTargetRegion] = useState('All');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [scriptTag, setScriptTag] = useState('');
  const [subscriberCount, setSubscriberCount] = useState<number>(0);

  useEffect(() => {
    setScriptTag(`<script src="${window.location.origin}/api/sdk" data-project-id="${projectId}"></script>`);
  }, [projectId]);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    supabase.from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
      .then(({ data }) => {
        if (data) {
          setAppName(data.name || '');
          setSiteUrl(data.site_url || '');
          setBroadcastCount(data.broadcast_count || 0);
        }
      });

    supabase.from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .then(({ count }) => {
        if (count !== null) setSubscriberCount(count);
      });
  }, [projectId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      setStatus('Error: Image size must be under 2MB.');
      return;
    }

    try {
      setLoading(true);
      setStatus('Uploading image...');
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error);
      
      setImage(uploadData.url);
      setStatus('Image uploaded successfully! Ready to broadcast.');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      setStatus('Error: Please fill out both fields.');
      return;
    }

    setLoading(true);
    setStatus('Broadcasting...');

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          body, 
          image, 
          targetOS,
          targetRegion, 
          scheduleTime,
          projectId 
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setStatus(`Successfully sent to ${data.sent} subscribers.`);
        setTitle('');
        setBody('');
        setImage('');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setStatus('Failed to send broadcast.');
    }
    setLoading(false);
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsStatus('Saving...');
    
    try {
      const formData = new FormData(e.currentTarget);
      const res = await updateProjectSettings(projectId, formData);
      if (res.error) setSettingsStatus(`Error: ${res.error}`);
      else setSettingsStatus('Settings saved successfully!');
    } catch (err) {
      setSettingsStatus('Error saving settings.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you absolutely sure you want to delete this project? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      const res = await deleteProject(projectId);
      if (res.success) {
        router.push('/dashboard');
        router.refresh(); // Invalidate cache so dashboard updates
      } else {
        alert(res.error || 'Failed to delete project');
        setIsDeleting(false);
      }
    } catch (err) {
      alert('Failed to delete project');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Project Workspace</h1>
          <div className="flex items-center gap-3">
            <span className="text-[#a1a1aa] text-sm font-mono">ID: {projectId}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(projectId);
                alert('Project ID copied to clipboard!');
              }}
              className="text-[#8BAAA8] hover:text-white transition-colors bg-[#111111] border border-[#333333] rounded px-2 py-1 text-xs flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Start Guide */}
      <div className="mb-10 bg-[#111111]/50 border border-[#8BAAA8]/20 rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Start Installation
        </h2>
        <p className="text-sm text-[#a1a1aa] mb-4">Paste this script tag anywhere in the <code className="text-[#8BAAA8] bg-[#000000] px-1 py-0.5 rounded">&lt;head&gt;</code> of your website to enable push notifications. It will automatically detect your Site URL and Favicon!</p>
        <div className="relative group">
          <pre className="bg-[#000000] border border-[#333333] p-4 rounded-lg overflow-x-auto text-sm text-[#ededed] font-mono whitespace-pre-wrap break-all">
            {scriptTag || 'Loading...'}
          </pre>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(scriptTag);
              alert('Script copied to clipboard!');
            }}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111111] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-white"
          >
            Copy Code
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0a0a0a] border border-[#333333] rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Subscribers</p>
            <p className="text-2xl font-semibold text-white">{subscriberCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-[#333333] rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Broadcasts</p>
            <p className="text-2xl font-semibold text-white">{broadcastCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-[#333333] rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
            <p className="text-2xl font-semibold text-[#8BAAA8] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8BAAA8] animate-pulse"></span>
              Active
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#333333] rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleBroadcast} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notification Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-[#111111] border ${status?.includes('fill') ? 'border-red-500/50' : 'border-[#333333]'} rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#8BAAA8] transition-all`}
              placeholder="e.g. New Project Live!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notification Body</label>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className={`w-full bg-[#111111] border ${status?.includes('fill') ? 'border-red-500/50' : 'border-[#333333]'} rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#8BAAA8] transition-all resize-none`}
              placeholder="Check out my new portfolio update..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Image (Optional, Max 2MB)</label>
            <div className="flex flex-col gap-4">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#111111] file:text-white hover:file:bg-[#222222] transition-all cursor-pointer disabled:opacity-50"
              />
              {status === 'Uploading image...' && (
                <p className="text-sm text-zinc-400 animate-pulse">Uploading...</p>
              )}
              {image && status !== 'Uploading image...' && (
                <div className="relative mt-2 rounded-lg overflow-hidden border border-[#333333] bg-[#111111] w-full max-w-sm aspect-video">
                  <img src={image} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          <div className="border border-[#333333] rounded-lg overflow-hidden bg-[#0a0a0a]">
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-zinc-300 hover:bg-[#111111] transition-colors"
            >
              Advanced Settings (Segments & Scheduling)
              <span>{showAdvanced ? '▲' : '▼'}</span>
            </button>
            {showAdvanced && (
              <div className="p-4 border-t border-[#333333] flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Target Audience (Segment)</label>
                  <select 
                    value={targetOS}
                    onChange={(e) => setTargetOS(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="All">All Users</option>
                    <option value="Windows">Windows Users Only</option>
                    <option value="Mac">Mac Users Only</option>
                    <option value="Android">Android Users Only</option>
                    <option value="iOS">iOS Users Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Target Region</label>
                  <select 
                    value={targetRegion}
                    onChange={(e) => setTargetRegion(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="All">Global (All Regions)</option>
                    <option value="America">Americas (US, CA, SA)</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Australia">Oceania / Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Schedule Delivery (Optional)</label>
                  <div className="flex gap-2">
                    <input 
                      type="datetime-local" 
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="flex-1 bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-white focus:outline-none [color-scheme:dark]"
                    />
                    {scheduleTime && (
                      <button 
                        type="button" 
                        onClick={() => setScheduleTime('')}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-medium py-3 px-4 rounded-md transition-all border ${
                loading 
                  ? 'bg-[#111111] border-[#333333] text-[#666666] cursor-not-allowed' 
                  : 'bg-[#111111] border-[#333333] hover:border-[#8BAAA8] text-[#ededed] hover:text-[#8BAAA8] hover:shadow-[0_0_15px_rgb(139,170,168,0.15)]'
              }`}
            >
              {loading ? 'Broadcasting...' : 'Broadcast Notification'}
            </button>
            
            {status && (
              <div className={`mt-4 p-3 rounded-md border text-sm ${status.includes('Error') || status.includes('Failed') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#4A696C]/20 border-[#8BAAA8]/30 text-[#8BAAA8]'}`}>
                {status}
              </div>
            )}
          </form>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col items-center">
          <div className="w-full max-w-sm bg-[#000000] border border-[#333333] rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 text-center">Live Preview</h3>
            
            <div className="flex items-center justify-center gap-2 mb-6 bg-[#111111] p-1 rounded-lg">
              {(['windows', 'mac', 'android', 'ios'] as const).map((os) => (
                <button
                  key={os}
                  onClick={() => setPreviewOS(os)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                    previewOS === os ? 'bg-[#333333] text-white' : 'text-zinc-400 hover:text-white hover:bg-[#222222]'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>

            <div className="min-h-[250px] flex items-center justify-center pb-6">
              <NotificationPreview 
                title={title} 
                body={body} 
                image={image} 
                appName={appName} 
                siteUrl={siteUrl}
                icon={icon} 
                os={previewOS} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#333333] rounded-xl overflow-hidden shadow-2xl">
        <div className="border-b border-[#333333] px-8 py-5 bg-[#111111]/50">
          <h2 className="text-lg font-medium text-white">Project Settings</h2>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Project Name</label>
              <input 
                type="text" 
                name="name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#8BAAA8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Site URL</label>
              <input 
                type="url" 
                name="site_url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#8BAAA8] transition-colors"
              />
              <p className="text-xs text-zinc-500 mt-2">Make sure to include https://</p>
            </div>
            
            <div className="flex items-center gap-4 pt-2">
              <button 
                type="submit" 
                disabled={settingsLoading}
                className="bg-[#ededed] text-[#000000] font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                {settingsLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {settingsStatus && (
                <span className={`text-sm ${settingsStatus.includes('Error') ? 'text-red-400' : 'text-[#8BAAA8]'}`}>
                  {settingsStatus}
                </span>
              )}
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-red-500/20">
            <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
            <p className="text-sm text-zinc-500 mb-4">Permanently delete this project and all of its subscribers and broadcast history. This action cannot be undone.</p>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
