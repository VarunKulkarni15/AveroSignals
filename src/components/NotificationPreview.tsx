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
      <div className="w-[360px] bg-[#202020] border border-[#333333] rounded-lg shadow-2xl flex flex-col overflow-hidden text-left font-sans mx-auto pb-3">
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={defaultIcon} className="w-12 h-12 flex-shrink-0 object-cover bg-zinc-800 rounded-sm" alt="" />
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[#ffffff] text-[14px] font-semibold truncate leading-tight">{defaultTitle}</p>
            <p className="text-[#cccccc] text-[13px] mt-0.5 line-clamp-2 leading-snug break-words">{defaultBody}</p>
          </div>
        </div>
        
        {image && (
          <div className="w-full h-48 bg-[#1A1A1A] mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    );
  }

  if (os === 'mac') {
    return (
      <div className="w-[340px] bg-[#2A2A2A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col text-left font-sans mx-auto py-3">
        <div className="flex items-start gap-3 px-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="preview" className="w-full h-auto rounded-lg object-cover max-h-40" />
          </div>
        )}
      </div>
    );
  }

  if (os === 'android') {
    return (
      <div className="w-[320px] bg-[#1a1a1a] rounded-2xl shadow-xl flex flex-col overflow-hidden text-left font-sans mx-auto">
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <div className="w-4 h-4 rounded-full border-[1.5px] border-white/70 flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white/70 rounded-full"></div>
          </div>
          <p className="text-white/70 text-[12px] font-medium">Chrome • {displayUrl} • now</p>
          <span className="text-white/50 text-[10px] ml-auto">⌄</span>
        </div>
        <div className="px-4 py-2 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[#ffffff] text-[14px] font-medium leading-tight truncate">{defaultTitle}</p>
            <p className="text-[#cccccc] text-[13px] mt-1 line-clamp-2 leading-snug break-words">{defaultBody}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={defaultIcon} className="w-10 h-10 rounded flex-shrink-0 object-cover bg-zinc-800" alt="" />
        </div>
        {image && (
           <div className="w-full h-40 bg-[#1A1A1A] mt-1">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={image} alt="preview" className="w-full h-full object-cover" />
           </div>
        )}
      </div>
    );
  }

  // iOS (no large image support natively for simple web push)
  return (
    <div className="w-[340px] bg-[#252525]/90 backdrop-blur-2xl rounded-[20px] shadow-2xl flex flex-col text-left font-sans p-3 mx-auto">
      <div className="flex items-center gap-2 mb-1 px-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={defaultIcon} className="w-5 h-5 rounded-[5px] flex-shrink-0 object-cover bg-zinc-800" alt="" />
        <p className="text-white/60 text-[12px] font-semibold tracking-wide">{displayUrl}</p>
        <span className="text-white/40 text-[12px] ml-auto">now</span>
      </div>
      <div className="px-1 mt-1">
        <p className="text-white text-[15px] font-semibold leading-tight truncate">{defaultTitle}</p>
        <p className="text-white/90 text-[15px] mt-0.5 line-clamp-2 leading-snug break-words">{defaultBody}</p>
      </div>
    </div>
  );
}
