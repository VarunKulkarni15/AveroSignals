'use client'

import { useState, useRef, useEffect } from 'react'
import { logout } from '@/app/login/actions'

export default function UserDropdown({ email, avatarUrl }: { email: string, avatarUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4A696C] to-[#2c3e40] flex items-center justify-center text-white font-medium text-sm border border-[#333333] hover:border-[#666666] transition-colors overflow-hidden shrink-0 p-0"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          email.charAt(0).toUpperCase()
        )}
      </button>

      {isOpen && (
        <div className="absolute left-12 bottom-0 mb-0 w-56 bg-[#111111] border border-[#333333] rounded-lg shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-4 py-3 border-b border-[#222222]">
            <p className="text-sm font-medium text-[#ededed] truncate">Signed in as</p>
            <p className="text-xs text-[#a1a1aa] truncate mt-0.5">{email}</p>
          </div>
          
          <div className="py-1">
            <button 
              onClick={() => logout()}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1a1a1a] hover:text-red-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
