import type { ReactNode } from 'react'
import SettingsNav from '@/app/components/settings/SettingsNav'
import AppShell from '@/app/components/dashboard/AppShell'

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <section className="space-y-6">
        <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage communication, team access, business profile, and integrations</p>
          <div className="mt-4">
            <SettingsNav />
          </div>
        </header>
        {children}
      </section>
    </AppShell>
  )
}
