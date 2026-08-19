'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserDropdown from './UserDropdown'

export default function Sidebar({ email, avatarUrl }: { email: string, avatarUrl?: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
            PushHub
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
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors overflow-hidden whitespace-nowrap group
                ${isActive ? 'bg-bg-input text-white' : 'text-[#a1a1aa] hover:bg-bg-input hover:text-white'}
              `}
            >
              <div className={`${isActive ? 'text-[#8BAAA8]' : 'text-[#666666] group-hover:text-white'} transition-colors`}>
                {item.icon}
              </div>
              <span className={`font-medium text-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User Area */}
      <div className="p-3 border-t border-border-main flex items-center overflow-hidden whitespace-nowrap">
        <UserDropdown email={email} avatarUrl={avatarUrl} />
        <span className={`ml-3 text-sm text-[#a1a1aa] truncate transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {email}
        </span>
      </div>
    </aside>
  )
}
