'use client';

import { useState, useEffect } from 'react';

export default function ThemeTweaker() {
  const [isOpen, setIsOpen] = useState(false);
  
  // States mapping to CSS variables
  const [brandH, setBrandH] = useState(178);
  const [bgS, setBgS] = useState(15);
  const [bgMainL, setBgMainL] = useState(0);
  const [bgCardL, setBgCardL] = useState(4);
  const [bgInputL, setBgInputL] = useState(7);

  // Apply to root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-h', brandH.toString());
    root.style.setProperty('--bg-h', brandH.toString()); // Keep bg hue synced with brand
    root.style.setProperty('--bg-s', bgS + '%');
    root.style.setProperty('--bg-main-l', bgMainL + '%');
    root.style.setProperty('--bg-card-l', bgCardL + '%');
    root.style.setProperty('--bg-input-l', bgInputL + '%');
    root.style.setProperty('--border-l', (bgCardL + 8) + '%'); // Automatically scale border
  }, [brandH, bgS, bgMainL, bgCardL, bgInputL]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-bg-input border border-border-main rounded-full shadow-2xl flex items-center justify-center z-[9999] hover:bg-[#222222] transition-colors group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">🎨</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-bg-card border border-border-main rounded-xl shadow-2xl p-6 z-[9999] text-white flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Theme Tweaker</h3>
        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 flex justify-between">
          <span>Brand Color Hue</span>
          <span className="text-[#8BAAA8]">{brandH}</span>
        </label>
        <input type="range" min="0" max="360" value={brandH} onChange={(e) => setBrandH(Number(e.target.value))} className="accent-[#8BAAA8]" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 flex justify-between">
          <span>Brand Tint (Saturation)</span>
          <span className="text-[#8BAAA8]">{bgS}%</span>
        </label>
        <input type="range" min="0" max="100" value={bgS} onChange={(e) => setBgS(Number(e.target.value))} className="accent-[#8BAAA8]" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 flex justify-between">
          <span>Background Lightness</span>
          <span className="text-[#8BAAA8]">{bgMainL}%</span>
        </label>
        <input type="range" min="0" max="15" value={bgMainL} onChange={(e) => setBgMainL(Number(e.target.value))} className="accent-[#8BAAA8]" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 flex justify-between">
          <span>Card Lightness</span>
          <span className="text-[#8BAAA8]">{bgCardL}%</span>
        </label>
        <input type="range" min="0" max="25" value={bgCardL} onChange={(e) => setBgCardL(Number(e.target.value))} className="accent-[#8BAAA8]" />
      </div>
      
      <p className="text-[10px] text-zinc-500 text-center mt-2 leading-tight">
        Slide to find your perfect blend. Tell me the numbers when you're done!
      </p>
    </div>
  );
}
