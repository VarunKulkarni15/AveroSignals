'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import NotificationPreview from '@/components/NotificationPreview';
import { updateProjectSettings, deleteProject } from './actions';
import { generateApiKey, grantQuota } from '../actions';

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
  const [iconUrl, setIconUrl] = useState('');
  const [broadcastCount, setBroadcastCount] = useState<number>(0);
  const [broadcastQuota, setBroadcastQuota] = useState<number>(10000);
  const [icon, setIcon] = useState('https://img.icons8.com/fluency/48/bell.png');
  const [secretApiKey, setSecretApiKey] = useState('');
  const [previewOS, setPreviewOS] = useState<'windows' | 'mac' | 'android' | 'ios'>('windows');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [adPlaying, setAdPlaying] = useState(false);
  
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
          setIconUrl(data.icon_url || '');
          setBroadcastCount(data.broadcast_count || 0);
          setBroadcastQuota(data.broadcast_quota || 10000);
          setSecretApiKey(data.secret_api_key || '');
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

  const handleGenerateKey = async () => {
    setSettingsLoading(true);
    setSettingsStatus('Generating key...');
    try {
      const res = await generateApiKey(projectId);
      if (res.error) setSettingsStatus(`Error: ${res.error}`);
      else {
        setSecretApiKey(res.key!);
        setSettingsStatus('Key generated successfully!');
      }
    } catch (err) {
      setSettingsStatus('Failed to generate key.');
    } finally {
      setSettingsLoading(false);
    }
  };

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
              className="text-[#8BAAA8] hover:text-white transition-colors bg-bg-input border border-border-main rounded px-2 py-1 text-xs flex items-center gap-1"
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
      <div className="mb-10 bg-bg-input/50 border border-[#8BAAA8]/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border-main">
          <h2 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Start Installation
          </h2>
          <p className="text-sm text-[#a1a1aa]">Follow these two steps to instantly add push notifications to your website.</p>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Step 1 */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8BAAA8] text-black text-xs font-bold flex items-center justify-center">1</span>
              Install the Service Worker
            </h3>
            <p className="text-sm text-zinc-400 mb-4 pl-8">
              Push notifications require a background worker to receive messages when your site is closed. Download this file and place it in the <strong>root directory</strong> of your website (e.g., <code className="text-[#8BAAA8]">https://yoursite.com/avero-sw.js</code>).
            </p>
            <div className="pl-8">
              <a 
                href="/avero-sw.js" 
                download="avero-sw.js"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222222] border border-border-main text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download avero-sw.js
              </a>
            </div>
          </div>

          <div className="h-px bg-border-main ml-8"></div>

          {/* Step 2 */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8BAAA8] text-black text-xs font-bold flex items-center justify-center">2</span>
              Add the SDK Script
            </h3>
            <p className="text-sm text-zinc-400 mb-4 pl-8">
              Paste this script tag anywhere in the <code className="text-[#8BAAA8] bg-bg-main px-1 py-0.5 rounded">&lt;head&gt;</code> of your website. It will automatically detect your Site URL and Favicon!
            </p>
            <div className="pl-8 relative group">
              <pre className="bg-bg-main border border-border-main p-4 rounded-lg overflow-x-auto text-sm text-[#ededed] font-mono whitespace-pre-wrap break-all">
                {scriptTag || 'Loading...'}
              </pre>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(scriptTag);
                  alert('Script copied to clipboard!');
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-input border border-border-main rounded px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-white"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-bg-card border border-border-main rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Subscribers</p>
            <p className="text-2xl font-semibold text-white">{subscriberCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-bg-input border border-border-main flex items-center justify-center">
            <svg className="w-5 h-5 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div className="bg-bg-card border border-border-main rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Broadcasts</p>
            <p className="text-2xl font-semibold text-white">{broadcastCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-bg-input border border-border-main flex items-center justify-center">
            <svg className="w-5 h-5 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        </div>
        <div className="bg-bg-card border border-border-main rounded-xl p-6 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Broadcast Quota</p>
              <p className="text-2xl font-semibold text-white">{broadcastCount} <span className="text-sm text-zinc-500 font-normal">/ {broadcastQuota}</span></p>
            </div>
            {broadcastCount >= broadcastQuota && (
              <span className="bg-red-500/20 text-red-400 text-[10px] uppercase font-bold px-2 py-1 rounded">Limit Reached</span>
            )}
          </div>
          <div className="w-full bg-bg-input rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${broadcastCount >= broadcastQuota ? 'bg-red-500' : 'bg-[#8BAAA8]'}`}
              style={{ width: `${Math.min((broadcastCount / broadcastQuota) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-bg-card/80 backdrop-blur-sm border border-border-main rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleBroadcast} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notification Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-bg-input border ${status?.includes('fill') ? 'border-red-500/50' : 'border-border-main'} rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#8BAAA8] transition-all`}
              placeholder="e.g. New Project Live!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notification Body</label>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className={`w-full bg-bg-input border ${status?.includes('fill') ? 'border-red-500/50' : 'border-border-main'} rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#8BAAA8] transition-all resize-none`}
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
                className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bg-input file:text-white hover:file:bg-[#222222] transition-all cursor-pointer disabled:opacity-50"
              />
              {status === 'Uploading image...' && (
                <p className="text-sm text-zinc-400 animate-pulse">Uploading...</p>
              )}
              {image && status !== 'Uploading image...' && (
                <div className="relative mt-2 rounded-lg overflow-hidden border border-border-main bg-bg-input w-full max-w-sm aspect-video">
                  <img src={image} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          <div className="border border-border-main rounded-lg overflow-hidden bg-bg-card">
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-zinc-300 hover:bg-bg-input transition-colors"
            >
              Advanced Settings (Segments & Scheduling)
              <span>{showAdvanced ? '▲' : '▼'}</span>
            </button>
            {showAdvanced && (
              <div className="p-4 border-t border-border-main flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Target Audience (Segment)</label>
                  <select 
                    value={targetOS}
                    onChange={(e) => setTargetOS(e.target.value)}
                    className="w-full bg-bg-input border border-border-main rounded px-3 py-2 text-sm text-white focus:outline-none"
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
                    className="w-full bg-bg-input border border-border-main rounded px-3 py-2 text-sm text-white focus:outline-none"
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
                      className="flex-1 bg-bg-input border border-border-main rounded px-3 py-2 text-sm text-white focus:outline-none [color-scheme:dark]"
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

            {broadcastCount >= broadcastQuota ? (
              <button 
                type="button" 
                onClick={() => setShowQuotaModal(true)}
                className="w-full font-medium py-3 px-4 rounded-md transition-all border bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Quota Reached — Unlock More
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full font-medium py-3 px-4 rounded-md transition-all border ${
                  loading 
                    ? 'bg-bg-input border-border-main text-[#666666] cursor-not-allowed' 
                    : 'bg-bg-input border-border-main hover:border-[#8BAAA8] text-[#ededed] hover:text-[#8BAAA8] hover:shadow-[0_0_15px_rgb(139,170,168,0.15)]'
                }`}
              >
                {loading ? 'Broadcasting...' : 'Broadcast Notification'}
              </button>
            )}
            
            {status && (
              <div className={`mt-4 p-3 rounded-md border text-sm ${status.includes('Error') || status.includes('Failed') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#4A696C]/20 border-[#8BAAA8]/30 text-[#8BAAA8]'}`}>
                {status}
              </div>
            )}
          </form>
        </div>

        <div className="w-full lg:w-[500px] xl:w-[600px] flex flex-col items-center shrink-0">
          <div className="w-full bg-bg-main border border-border-main rounded-lg p-6 overflow-hidden">
            <h3 className="text-white font-semibold mb-4 text-center">Live Preview</h3>
            
            <div className="flex items-center justify-center gap-2 mb-6 bg-bg-input p-1 rounded-lg">
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
                icon={iconUrl || icon} 
                os={previewOS} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-bg-card/80 backdrop-blur-sm border border-border-main rounded-xl overflow-hidden shadow-2xl">
        <div className="border-b border-border-main px-8 py-5 bg-bg-input/50">
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
                className="w-full bg-bg-input border border-border-main rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#8BAAA8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Site URL</label>
              <input 
                type="url" 
                name="site_url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full bg-bg-input border border-border-main rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#8BAAA8] transition-colors"
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

          <div className="mt-12 pt-8 border-t border-border-main">
            <h3 className="text-white font-medium mb-2">Developer Settings</h3>
            <p className="text-sm text-zinc-400 mb-4">Use this Secret API Key to programmatically send push notifications from your backend servers.</p>
            {secretApiKey ? (
              <div className="bg-bg-main border border-border-main rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">Secret API Key</p>
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-sm text-[#8BAAA8] select-all">
                      {showApiKey ? secretApiKey : '••••••••••••••••••••••••••••••••••••'}
                    </p>
                    <button 
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-zinc-500 hover:text-white transition-colors p-1"
                      title={showApiKey ? "Hide API Key" : "Show API Key"}
                    >
                      {showApiKey ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(secretApiKey);
                    alert('API Key copied to clipboard!');
                  }}
                  className="bg-bg-input border border-border-main hover:border-[#8BAAA8] text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Copy Key
                </button>
              </div>
            ) : (
              <div className="bg-bg-main border border-border-main rounded-lg p-6 flex flex-col items-center justify-center text-center gap-3">
                <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <div>
                  <p className="text-white font-medium">No API Key Generated</p>
                  <p className="text-sm text-zinc-400 mt-1">Generate a key to securely send notifications from your server.</p>
                </div>
                <button 
                  type="button"
                  onClick={handleGenerateKey}
                  disabled={settingsLoading}
                  className="mt-2 bg-[#8BAAA8] hover:bg-[#729290] text-black font-semibold px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {settingsLoading ? 'Generating...' : 'Generate API Key'}
                </button>
              </div>
            )}
            <div className="mt-4">
              <Link href="/dashboard/docs" className="text-sm text-[#8BAAA8] hover:text-white underline underline-offset-4">Read the API Documentation →</Link>
            </div>
          </div>

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

      {/* Quota Modal */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-bg-main border border-border-main rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {adPlaying ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-white font-medium mb-4 text-lg">Sponsor Message</h3>
                <div className="w-full aspect-video bg-black rounded-lg border border-border-main overflow-hidden relative">
                  {/* Mock Video Ad using HTML5 */}
                  <video 
                    autoPlay 
                    className="w-full h-full object-cover"
                    onEnded={async () => {
                      setAdPlaying(false);
                      const res = await grantQuota(projectId, 5000);
                      if (res.success) {
                        alert("Reward unlocked! +5,000 Broadcasts added to your account.");
                        setBroadcastQuota(q => q + 5000);
                      } else {
                        alert("Error unlocking reward.");
                      }
                      setShowQuotaModal(false);
                    }}
                  >
                    <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 text-[10px] text-white rounded">Advertisement</div>
                </div>
                <p className="text-zinc-500 text-sm mt-4">Reward will be granted when the video finishes.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-input/50">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Unlock More Broadcasts</h2>
                    <p className="text-sm text-zinc-400 mt-1">You've reached your {broadcastQuota} limit for this month.</p>
                  </div>
                  <button onClick={() => setShowQuotaModal(false)} className="text-zinc-500 hover:text-white p-2">✕</button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="bg-bg-input border border-border-main rounded-xl p-5 hover:border-[#8BAAA8] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">Share on X (Twitter)</h3>
                        <p className="text-sm text-zinc-400">Post about us to get <span className="text-[#8BAAA8] font-bold">+2,500</span> broadcasts instantly.</p>
                      </div>
                      <button 
                        onClick={async () => {
                          window.open(`https://twitter.com/intent/tweet?text=Just%20started%20using%20Avero Signals%20for%20my%20push%20notifications!%20%40Avero SignalsApp&url=${encodeURIComponent(window.location.origin)}`, '_blank');
                          const res = await grantQuota(projectId, 2500);
                          if (res.success) {
                            alert("Thank you for sharing! +2,500 Broadcasts added.");
                            setBroadcastQuota(q => q + 2500);
                          } else {
                            alert("Error unlocking reward.");
                          }
                          setShowQuotaModal(false);
                        }}
                        className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Share Now
                      </button>
                    </div>
                  </div>

                  <div className="bg-bg-input border border-border-main rounded-xl p-5 hover:border-[#8BAAA8] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">Watch Sponsor Video</h3>
                        <p className="text-sm text-zinc-400">Watch a 15-second ad to get <span className="text-[#8BAAA8] font-bold">+5,000</span> broadcasts.</p>
                      </div>
                      <button 
                        onClick={() => setAdPlaying(true)}
                        className="px-4 py-2 bg-[#8BAAA8] text-black text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Watch Ad
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-border-main bg-bg-input/30 text-center">
                  <p className="text-xs text-zinc-500">Need unlimited sending? <a href="#" className="text-[#8BAAA8] hover:underline">Upgrade to Pro</a></p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
