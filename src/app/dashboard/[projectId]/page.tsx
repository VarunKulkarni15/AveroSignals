'use client';

import { useState, useEffect } from 'react';
import NotificationPreview from '@/components/NotificationPreview';

export default function Dashboard({ params }: { params: { projectId: string } }) {
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

  useEffect(() => {
    // Fetch actual site metadata from the backend
    fetch('/api/subscribe')
      .then(res => res.json())
      .then(data => {
        if (data.metadata) {
          setAppName(data.metadata.siteName || 'My Portfolio');
          setSiteUrl(data.metadata.siteUrl || 'localhost:3000');
          if (data.metadata.siteIcon) {
            setIcon(data.metadata.siteIcon);
          }
        }
      })
      .catch(console.error);
  }, []);

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
          projectId: params.projectId 
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

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] font-sans selection:bg-[#4A696C]/30">
      <header className="border-b border-[#333333] bg-[#000000] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-[#a1a1aa] hover:text-white mr-2">← Back</Link>
          <div className="w-8 h-8 rounded border border-[#333333] bg-[#111111] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h1 className="font-medium text-lg text-white">Broadcast</h1>
        </div>
      </header>

      <div className="p-8 md:p-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="flex-1 bg-[#000000] border border-[#333333] rounded-lg p-8">
          <form onSubmit={handleBroadcast} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notification Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#8BAAA8] transition-all"
              placeholder="e.g. New Project Live!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notification Body</label>
            <textarea 
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#8BAAA8] transition-all resize-none"
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
      </div>
    </div>
  );
}
