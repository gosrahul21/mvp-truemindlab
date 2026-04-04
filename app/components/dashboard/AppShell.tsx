'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import AuthSidebar from '@/app/components/dashboard/AuthSidebar'

export default function AppShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0A0D12] text-[#E8EBF2] font-sans selection:bg-[#4F7EFF33] selection:text-[#4F7EFF]">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-[56px] border-b border-[#ffffff12] bg-[#0A0D12] z-[110] flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[7px] bg-gradient-to-br from-[#4F7EFF] to-[#7B5FFF] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="none"><path d="M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 7.75c-2 0-3.76-1.02-4.8-2.57.02-1.59 3.2-2.47 4.8-2.47 1.59 0 4.78.88 4.8 2.47C11.76 11.23 10 12.25 8 12.25z" fill="white"/></svg>
          </div>
          <span className="font-['Fraunces'] text-[15px] text-[#E8EBF2]">Pulse AI</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#8B92A8] hover:text-[#E8EBF2]"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </header>

      {/* SIDEBAR (Desktop + Mobile Overlay) */}
      <div className={`
        fixed inset-y-0 left-0 z-[120] lg:z-[100] transform transition-transform duration-300 lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AuthSidebar />
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[115] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:pl-[240px] flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col pt-[56px] lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
