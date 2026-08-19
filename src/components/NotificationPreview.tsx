"use client";

import React from 'react';

interface PreviewProps {
  title: string;
  body: string;
  image?: string;
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
      <div className="w-[360px] bg-[#2D2D2D] border border-white/10 rounded-md shadow-2xl flex flex-col overflow-hidden text-left font-sans mx-auto">
        <div className="flex items-center gap-3 p-4 pb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={defaultIcon} className="w-8 h-8 rounded flex-shrink-0 object-cover bg-zinc-800" alt="" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate leading-tight">{defaultTitle}</p>
            <p className="text-white/70 text-xs mt-0.5 truncate">{displayUrl}</p>
          </div>
          <span className="text-white/50 text-[10px]">Now</span>
        </div>
        <div className="px-4 pb-3">
          <p className="text-white/90 text-sm leading-snug line-clamp-2 break-words">{defaultBody}</p>
        </div>
        {image && (
          <div className="w-full h-40 bg-[#1A1A1A]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    );
  }

  if (os === 'mac') {
    return (
      <div className="w-[340px] bg-[#1E1E1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left font-sans mx-auto">
        <div className="flex items-start gap-3 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={defaultIcon} className="w-10 h-10 rounded-lg shadow-sm flex-shrink-0 object-cover bg-zinc-800" alt="" />
          <div className="flex-1 pt-0.5 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider">{displayUrl}</p>
              <span className="text-white/40 text-[10px]">Now</span>
            </div>
            <p className="text-white text-[13px] font-bold leading-tight truncate">{defaultTitle}</p>
            <p className="text-white/80 text-[13px] mt-0.5 line-clamp-2 leading-snug break-words">{defaultBody}</p>
          </div>
        </div>
        {image && (
          <div className="px-4 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="preview" className="w-full h-auto rounded-lg object-cover max-h-40" />
          </div>
        )}
      </div>
    );
  }

  if (os === 'android') {
    return (
      <div className="w-[320px] bg-[#121212] rounded-2xl shadow-xl flex flex-col overflow-hidden text-left font-sans border border-white/5 mx-auto">
        <div className="flex items-center gap-2 p-3 pb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={defaultIcon} className="w-4 h-4 rounded-sm grayscale opacity-70 flex-shrink-0 object-cover bg-zinc-800" alt="" />
          <p className="text-white/60 text-[11px] font-medium">{displayUrl} • now</p>
          <span className="text-white/50 text-[10px] ml-auto">▼</span>
        </div>
        {image && (
           <div className="w-full h-40 bg-[#1A1A1A]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={image} alt="preview" className="w-full h-full object-cover" />
           </div>
        )}
        <div className="p-3 pt-2">
          <p className="text-white text-sm font-semibold leading-tight truncate">{defaultTitle}</p>
          <p className="text-white/70 text-[13px] mt-1 line-clamp-2 leading-snug break-words">{defaultBody}</p>
        </div>
      </div>
    );
  }

  // iOS (no large image support natively for simple web push)
  return (
    <div className="w-[340px] bg-[#252525]/90 backdrop-blur-2xl rounded-[24px] shadow-2xl flex flex-col overflow-hidden text-left font-sans p-3 pb-4 mx-auto border border-white/10">
      <div className="flex items-center gap-2 mb-2 px-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={defaultIcon} className="w-5 h-5 rounded flex-shrink-0 object-cover bg-zinc-800" alt="" />
        <p className="text-white/60 text-[11px] font-medium tracking-wide uppercase">{defaultAppName}</p>
        <span className="text-white/40 text-[11px] ml-auto">now</span>
      </div>
      <div className="px-1">
        <p className="text-white text-[15px] font-semibold leading-tight truncate">{defaultTitle}</p>
        <p className="text-white/90 text-[15px] mt-0.5 line-clamp-2 leading-snug break-words">{defaultBody}</p>
      </div>
    </div>
  );
}
