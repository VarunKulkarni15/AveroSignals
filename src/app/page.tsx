import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur px-8 py-4 flex justify-between items-center fixed top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#24b47e] flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="font-semibold text-xl tracking-tight">PushHub</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-zinc-400 hover:text-white transition-colors py-2 text-sm font-medium">Log in</Link>
          <Link href="/login" className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors">Get Started</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-[#24b47e] mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#24b47e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#24b47e]"></span>
          </span>
          PushHub 2.0 is Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          Web Push Notifications,<br/>made ridiculously easy.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Drop in our SDK, connect your site, and start broadcasting real-time push notifications to your users across Windows, Mac, iOS, and Android.
        </p>
        
        <Link href="/login" className="bg-[#24b47e] text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#209f6e] hover:shadow-[0_0_40px_rgb(36,180,126,0.3)] transition-all transform hover:-translate-y-1">
          Start for free
        </Link>
      </main>

      <footer className="border-t border-zinc-900 py-8 text-center text-zinc-600 text-sm">
        <p>Built with Next.js & Supabase.</p>
      </footer>
    </div>
  )
}
