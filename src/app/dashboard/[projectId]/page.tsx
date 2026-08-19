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
  const [appName, setAppName] = useState('My Portfolio');
  const [siteUrl, setSiteUrl] = useState('localhost:3000');
  const [icon, setIcon] = useState('https://img.icons8.com/fluency/48/bell.png');
  const [previewOS, setPreviewOS] = useState<'windows' | 'mac' | 'android' | 'ios'>('windows');
  
  const [targetOS, setTargetOS] = useState('All');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
        }
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
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Project Workspace</h1>
        <p className="text-[#a1a1aa] text-sm font-mono">ID: {projectId}</p>
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

            <div className="min-h-[250px] flex items-center justify-center">
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

            <div className="mt-8 border-t border-[#333333] pt-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Site Settings</h4>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">App Name</label>
                  <input 
                    type="text" 
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-white focus:outline-none mb-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Site URL</label>
                  <input 
                    type="text" 
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Icon URL</label>
                  <input 
                    type="text" 
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
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
