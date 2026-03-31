'use client'

import type { ReactNode } from 'react'
import AuthSidebar from '@/app/components/dashboard/AuthSidebar'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/60 dark:from-[#070b14] dark:to-[#0a0f1b]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[260px_1fr] lg:px-10">
        
        {/* Sidebar */}
        <div className="sticky top-6 hidden h-[calc(100vh-3rem)] lg:block">
          <div className="h-full rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/10 dark:bg-gray-800/30 dark:border-gray-700">
            <AuthSidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Mobile sidebar fallback */}
          <div className="rounded-2xl border border-white/20 bg-white/20 backdrop-blur-xl p-4 shadow-lg shadow-black/10 dark:border-gray-700 dark:bg-gray-800/30 lg:hidden">
            <AuthSidebar />
          </div>

          {/* Page children */}
          <div className="space-y-6">{children}</div>
        </div>

      </div>
    </main>
  )
}
