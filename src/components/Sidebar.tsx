'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserDropdown from './UserDropdown'

export default function Sidebar({ email, avatarUrl }: { email: string, avatarUrl?: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const pathname = usePathname()
  const pathParts = pathname.split('/');
  const projectId = (pathParts.length >= 3 && pathParts[1] === 'dashboard' && pathParts[2] !== 'docs') ? pathParts[2] : null;

  const navItems = [
    {
      name: 'All Projects',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    ...(projectId ? [{
      name: 'Project Overview',
      href: `/dashboard/${projectId}`,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }] : []),
    {
      name: 'Campaigns',
      href: projectId ? `/dashboard/${projectId}/campaigns` : '/dashboard',
      isPro: false,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      name: 'Audience',
      href: '#',
      isPro: true,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Automations',
      href: '#',
      isPro: true,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      href: '#',
      isPro: true,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Templates',
      href: '#',
      isPro: true,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      )
    },
    {
      name: 'Email & SMS',
      href: '#',
      isPro: true,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Documentation',
      href: '/dashboard/docs',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Billing',
      href: '#',
      isPro: true,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ]

  return (
    <aside 
      className={`h-screen sticky top-0 bg-bg-main border-r border-border-main z-40 transition-all duration-300 flex flex-col shrink-0 ${isExpanded ? 'w-64' : 'w-16'}`}
    >
      {/* Logo & Toggle Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-main relative">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 shrink-0 rounded border border-border-main bg-bg-input flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className={`font-medium text-lg tracking-wide text-white transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Avero Signals
          </span>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className={`absolute -right-3 top-5 bg-bg-input border border-border-main rounded-full p-1 text-[#a1a1aa] hover:text-white hover:border-[#666666] transition-colors z-50 flex items-center justify-center`}
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if ((item as any).isPro) {
                  e.preventDefault();
                  setToastMessage(`${item.name} is currently in development! Upgrade coming soon.`);
                  setTimeout(() => setToastMessage(null), 3000);
                } else if (item.name === 'Campaigns' && !projectId) {
                  e.preventDefault();
                  setToastMessage(`Select a project first to view Campaigns.`);
                  setTimeout(() => setToastMessage(null), 3000);
                }
              }}
              className={`flex items-center justify-between px-2 py-2.5 rounded-lg transition-colors overflow-hidden whitespace-nowrap group
                ${isActive ? 'bg-bg-input text-white' : 'text-[#a1a1aa] hover:bg-bg-input hover:text-white'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`${isActive ? 'text-[#8BAAA8]' : 'text-[#666666] group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </div>
                <span className={`font-medium text-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  {item.name}
                </span>
              </div>
              {(item as any).isPro && (
                <div className={`text-[#8BAAA8] opacity-50 group-hover:opacity-100 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} title="Coming Soon">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Area */}
      <div className="p-3 border-t border-border-main flex items-center overflow-hidden whitespace-nowrap relative">
        <UserDropdown email={email} avatarUrl={avatarUrl} />
        <span className={`ml-3 text-sm text-[#a1a1aa] truncate transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {email}
        </span>
      </div>

      {/* Custom Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#1a1a1a] border border-[#333333] shadow-2xl rounded-lg px-4 py-3 flex items-center gap-3 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium text-white">{toastMessage}</p>
        </div>
      )}
    </aside>
  )
}
