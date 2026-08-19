"use client";

import React from 'react';

interface PreviewProps {
  title: string;
  body: string;
  image?: string;
  appName: string;
  siteUrl?: string;
  icon: string;
  os: 'windows' | 'mac' | 'android' | 'ios';
}

export default function NotificationPreview({ title, body, image, appName, siteUrl, icon, os }: PreviewProps) {
  const defaultTitle = title || 'Notification Title';
  const defaultBody = body || 'Notification body text goes here...';
  const defaultIcon = icon || '/icon.png';
  const defaultAppName = appName || 'PushHub App';
  const displayUrl = siteUrl || defaultAppName;

  if (os === 'windows') {
    return (
      <div className="relative w-full max-w-[420px] h-[320px] bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-xl overflow-hidden shadow-2xl border border-border-main font-sans flex flex-col mx-auto">
        {/* Desktop Area */}
        <div className="flex-1 relative">
          {/* Notification Card */}
          <div className="absolute bottom-4 right-3 w-[360px] bg-[#202020] border border-border-main rounded-lg shadow-2xl flex flex-col overflow-hidden text-left pb-3 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-green-400 via-yellow-400 to-red-500 p-[2px]">
                   <div className="w-full h-full bg-blue-500 rounded-full border-[1px] border-white"></div>
                </div>
                <span className="text-[#a1a1aa] text-[11px] font-medium">Google Chrome • {displayUrl}</span>
              </div>
              <div className="flex items-center gap-3 text-[#a1a1aa]">
                <span className="text-[14px]">⋯</span>
                <span className="text-[12px]">✕</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3 px-3 py-1">
              <img src={defaultIcon} className="w-12 h-12 flex-shrink-0 object-cover bg-zinc-800 rounded-sm" alt="" />
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[#ffffff] text-[14px] font-semibold truncate leading-tight">{defaultTitle}</p>
                <p className="text-[#cccccc] text-[13px] mt-0.5 line-clamp-2 leading-snug break-words">{defaultBody}</p>
              </div>
            </div>
            
            {image && (
              <div className="w-full h-32 bg-[#1A1A1A] mt-3">
                <img src={image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Windows 11 Taskbar */}
        <div className="h-10 bg-[#1e1e1e]/90 backdrop-blur-md border-t border-border-main flex items-center justify-between px-2 shrink-0">
          <div className="flex items-center gap-2">
            {/* Start Button Mock */}
            <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
              </svg>
            </div>
            {/* Search Mock */}
            <div className="w-24 h-6 bg-white/10 rounded-full"></div>
          </div>
          <div className="flex items-center gap-3 pr-2">
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="text-[10px] text-zinc-400 text-right leading-tight ml-1">
              7:04 PM<br/>8/19/2026
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (os === 'mac') {
    return (
      <div className="relative w-full max-w-[420px] h-[320px] bg-cover bg-center rounded-xl overflow-hidden shadow-2xl border border-border-main font-sans flex flex-col mx-auto" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop')" }}>
        {/* macOS Menu Bar */}
        <div className="h-6 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 text-white text-[11px] font-medium shrink-0">
          <div className="flex items-center gap-4">
            <svg className="w-3 h-3" viewBox="0 0 384 512" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 47.1-.8 81.5-68.5 98.7-122.4-32.4-16.7-58-48.4-57.8-88.2zM245.2 65.5C270.4 34.6 261 14 261 14c-26.5 1.5-56 16.8-71.5 39.2-12.8 18.1-23.3 45.4-19.7 70.8 28.5 2.1 55.4-23.7 75.4-58.5z"/>
            </svg>
            <span>Finder</span>
            <span>File</span>
            <span>Edit</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <span>Wed Aug 19 7:04 PM</span>
          </div>
        </div>

        {/* Desktop Area */}
        <div className="flex-1 relative">
          <div className="absolute top-2 right-2 w-[340px] bg-[#2A2A2A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col text-left py-3 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-start gap-3 px-3">
              <img src={defaultIcon} className="w-10 h-10 rounded-[10px] flex-shrink-0 object-cover bg-zinc-800 mt-1" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-white text-[13px] font-bold truncate">{defaultTitle}</p>
                  <span className="text-white/40 text-[10px] ml-2">now</span>
                </div>
                <p className="text-white/60 text-[11px] uppercase tracking-wider font-semibold truncate">{displayUrl}</p>
                <p className="text-[#cccccc] text-[13px] mt-0.5 line-clamp-2 leading-snug break-words">{defaultBody}</p>
              </div>
            </div>
            {image && (
              <div className="px-3 mt-3">
                <img src={image} alt="preview" className="w-full h-auto rounded-lg object-cover max-h-32" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (os === 'android') {
    return (
      <div className="relative w-[340px] h-[400px] bg-[#e5e5e5] rounded-[30px] shadow-2xl border-[6px] border-[#1a1a1a] font-sans flex flex-col mx-auto overflow-hidden">
        {/* Android Status Bar */}
        <div className="h-10 bg-transparent flex items-center justify-between px-4 text-[#4a4a4a] text-[12px] font-medium shrink-0 pt-2 z-10 relative">
          <span>7:04</span>
          {/* Punch Hole Camera */}
          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L15.6 16.2C14.6 15.45 13.35 15 12 15C10.65 15 9.4 15.45 8.4 16.2L12 21Z" /><path d="M12 3C7.95 3 4.2 4.65 1.2 7.65L12 22L22.8 7.65C19.8 4.65 16.05 3 12 3ZM12 15C13.35 15 14.6 15.45 15.6 16.2L12 21L8.4 16.2C9.4 15.45 10.65 15 12 15Z" fillOpacity="0.3"/></svg>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22H22V2L2 22ZM20 20H13V9L20 2V20Z"/><path d="M13 20V9L2 20H13Z" fillOpacity="0.3"/></svg>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z"/></svg>
            <span className="text-[10px] ml-0.5">80%</span>
          </div>
        </div>

        {/* App Content Area */}
        <div className="flex-1 relative pt-2 px-2">
          {/* Notification Card */}
          <div className="w-full bg-[#f8f9fa] rounded-[24px] shadow-lg flex flex-col overflow-hidden text-left font-sans mx-auto pb-4 pt-1 animate-in slide-in-from-top-4 duration-500 relative z-20">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="w-4 h-4 rounded-full border-[1.5px] border-[#1a1a1a] flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full"></div>
              </div>
              <p className="text-[#4a4a4a] text-[12px] font-medium flex-1 truncate">Chrome • {displayUrl} • now</p>
              <div className="w-6 h-6 bg-[#e5e5e5] rounded-full flex items-center justify-center text-[#4a4a4a]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
            
            <div className="px-4 py-1 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[#1a1a1a] text-[14px] font-medium leading-tight truncate">{defaultTitle}</p>
                <p className="text-[#4a4a4a] text-[13px] mt-1 line-clamp-2 leading-snug break-words">{defaultBody}</p>
              </div>
              <img src={defaultIcon} className="w-10 h-10 rounded-full flex-shrink-0 object-cover bg-zinc-200" alt="" />
            </div>
            
            {image && (
               <div className="w-full h-32 bg-[#e5e5e5] mt-3">
                 <img src={image} alt="preview" className="w-full h-full object-cover" />
               </div>
            )}

            <div className="px-4 pt-4 mt-2">
              <span className="text-[#4a4a4a] text-[13px]">Unsubscribe</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // iOS 
  return (
    <div className="relative w-[340px] h-[400px] bg-gradient-to-b from-[#e5e5ea] to-[#f2f2f7] rounded-[40px] shadow-2xl border-[12px] border-[#1a1a1a] font-sans flex flex-col mx-auto overflow-hidden">
      {/* iOS Status Bar */}
      <div className="h-12 bg-transparent flex items-center justify-between px-6 text-[#1a1a1a] text-[13px] font-semibold shrink-0 pt-2 z-10 relative">
        <span className="w-10">7:04</span>
        {/* Dynamic Island */}
        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[100px] h-[30px] bg-black rounded-full"></div>
        <div className="flex items-center gap-1.5 w-10 justify-end">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L15.6 16.2C14.6 15.45 13.35 15 12 15C10.65 15 9.4 15.45 8.4 16.2L12 21Z"/><path d="M12 3C7.95 3 4.2 4.65 1.2 7.65L12 22L22.8 7.65C19.8 4.65 16.05 3 12 3ZM12 15C13.35 15 14.6 15.45 15.6 16.2L12 21L8.4 16.2C9.4 15.45 10.65 15 12 15Z" fillOpacity="0.3"/></svg>
          <svg className="w-5 h-5 -mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z"/></svg>
        </div>
      </div>

      {/* App Content Area */}
      <div className="flex-1 relative pt-1 px-3">
        {/* iOS Notification Card */}
        <div className="w-full bg-[#f4f4f5]/90 backdrop-blur-2xl rounded-[24px] shadow-lg flex flex-col text-left font-sans p-3 mx-auto animate-in slide-in-from-top-4 duration-500 relative z-20">
          <div className="flex items-center gap-2 mb-1 px-1">
            <img src={defaultIcon} className="w-5 h-5 rounded-[5px] flex-shrink-0 object-cover bg-zinc-200" alt="" />
            <p className="text-[#1a1a1a] text-[13px] font-semibold tracking-wide">from {displayUrl}</p>
            <span className="text-[#8e8e93] text-[12px] ml-auto">now</span>
          </div>
          <div className="px-1 mt-1">
            <p className="text-[#1a1a1a] text-[15px] font-semibold leading-tight truncate">{defaultTitle}</p>
            <p className="text-[#3a3a3c] text-[15px] mt-0.5 line-clamp-2 leading-snug break-words">{defaultBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
