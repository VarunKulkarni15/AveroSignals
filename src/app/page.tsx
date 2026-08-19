'use client';

import { useState, useEffect } from 'react';
import NotificationPreview from '../components/NotificationPreview';

export default function Dashboard() {
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
        body: JSON.stringify({ title, body, image, targetOS, scheduleTime }),
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
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-24 font-sans selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">PushHub Dashboard</h1>
          <p className="text-zinc-400 text-sm">Broadcast custom notifications to your subscribers.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mt-12">
        {/* Left Column: Compose Form */}
        <div className="flex-1 bg-black/40 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl">
          <form onSubmit={handleBroadcast} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notification Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
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
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
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
                className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer disabled:opacity-50"
              />
              {status === 'Uploading image...' && (
                <p className="text-sm text-zinc-400 animate-pulse">Uploading...</p>
              )}
              {image && status !== 'Uploading image...' && (
                <div className="relative mt-2 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 w-full max-w-sm aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black/20">
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors"
            >
              Advanced Settings (Segments & Scheduling)
              <span>{showAdvanced ? '▲' : '▼'}</span>
            </button>
            {showAdvanced && (
              <div className="p-4 border-t border-zinc-800 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Target Audience (Segment)</label>
                  <select 
                    value={targetOS}
                    onChange={(e) => setTargetOS(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
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
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none [color-scheme:dark]"
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
                  <p className="text-[10px] text-zinc-500 mt-1">Leave blank to send immediately.</p>
                </div>
              </div>
            )}
          </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? 'Broadcasting...' : 'Broadcast Notification'}
            </button>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-sm bg-black/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-white font-semibold mb-4 text-center">Live Preview</h3>
            
            <div className="flex items-center justify-center gap-2 mb-6 bg-zinc-900/50 p-1 rounded-lg">
              {(['windows', 'mac', 'android', 'ios'] as const).map((os) => (
                <button
                  key={os}
                  onClick={() => setPreviewOS(os)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                    previewOS === os ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
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

            <div className="mt-8 border-t border-zinc-800 pt-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Site Settings</h4>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">App Name</label>
                  <input 
                    type="text" 
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none mb-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Site URL</label>
                  <input 
                    type="text" 
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Icon URL</label>
                  <input 
                    type="text" 
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {status && (
          <div className={`mt-6 p-4 rounded-lg text-sm border ${status.includes('Error') || status.includes('Failed') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
            {status}
          </div>
        )}
      </div>
    </main>
  );
}
