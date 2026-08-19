import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] font-sans selection:bg-[#4A696C]/30">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#000000] to-[#000000] pointer-events-none"></div>
      
      <header className="relative z-50 border-b border-[#333333] bg-[#000000]/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[#333333] bg-[#111111] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h1 className="font-medium text-lg tracking-wide text-white">PushHub</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-[#a1a1aa] hover:text-[#ededed] transition-colors py-2 text-sm font-medium">Log in</Link>
          <Link href="/login" className="px-4 py-1.5 rounded text-sm font-medium border border-[#333333] bg-[#1a1a1a] text-white hover:border-[#8BAAA8] hover:text-[#8BAAA8] transition-all">
            Get Started
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
        
        <p className="text-[#8BAAA8] text-sm tracking-[0.2em] font-medium uppercase mb-8">
          v2.0 Beta is Live
        </p>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-sm">
          Web Push Notifications,<br/>
          <span className="text-[#a1a1aa] font-normal">made ridiculously easy.</span>
        </h1>
        
        <p className="text-lg text-[#a1a1aa] mb-12 max-w-2xl mx-auto leading-relaxed">
          Drop in our lightweight SDK, connect your site, and start broadcasting real-time push notifications across Windows, Mac, iOS, and Android. No solid buttons allowed.
        </p>
        
        <Link href="/login" className="group flex items-center gap-2 px-8 py-3 rounded-md text-base font-medium border border-[#333333] bg-[#111111] hover:border-[#8BAAA8] hover:bg-[#8BAAA8]/5 transition-all text-[#ededed]">
          Start for free
          <svg className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#8BAAA8] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </main>
    </div>
  )
}
