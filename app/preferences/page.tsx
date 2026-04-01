'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Preferences</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Customize your workspace experience</p>
      </header>

      <form onSubmit={handleSave} className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
        
        <div className="space-y-8 max-w-xl">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map((t) => {
                const activeTheme = mounted ? theme : 'system'
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`rounded-xl border p-3 text-sm font-medium capitalize transition-all ${
                      activeTheme === t
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">Interface Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-100"
            >
              <option value="en">English (US)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </label>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button type="submit" disabled={loading} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </section>
  )
}
