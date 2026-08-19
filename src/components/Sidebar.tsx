'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserDropdown from './UserDropdown'

export default function Sidebar({ email, avatarUrl }: { email: string, avatarUrl?: string }) {
  const [isPinned, setIsPinned] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  const isExpanded = isPinned || isHovered

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
      href: 'https://docs.pushhub.com', // Placeholder
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Settings',
      href: '#', // Placeholder for global settings
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ]

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-[#000000] border-r border-[#333333] z-40 transition-all duration-300 flex flex-col ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo & Pin Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#333333]">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 shrink-0 rounded border border-[#333333] bg-[#111111] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className={`font-medium text-lg tracking-wide text-white transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            PushHub
          </span>
        </div>
        
        {isExpanded && (
          <button 
            onClick={() => setIsPinned(!isPinned)} 
            className={`text-[#666666] hover:text-[#ededed] transition-colors ${isPinned ? 'text-[#8BAAA8]' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isPinned ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              )}
            </svg>
          </button>
        )}
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
                ${isActive ? 'bg-[#111111] text-white' : 'text-[#a1a1aa] hover:bg-[#111111] hover:text-white'}
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
      <div className="p-3 border-t border-[#333333] flex items-center overflow-hidden whitespace-nowrap">
        <UserDropdown email={email} avatarUrl={avatarUrl} />
        <span className={`ml-3 text-sm text-[#a1a1aa] truncate transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {email}
        </span>
      </div>
    </aside>
  )
}
