'use client'

import { useState, useRef, useEffect } from 'react'
import { PencilIcon, Trash2Icon, MoreHorizontal } from 'lucide-react'

const members = [
  { name: 'Rahul Goswami', role: 'Owner', email: 'rahul@closeflow.ai' },
  { name: 'Aisha Khan', role: 'Admin', email: 'aisha@closeflow.ai' },
  { name: 'Marcus Lee', role: 'Staff', email: 'marcus@closeflow.ai' },
]

export default function TeamSettingsPage() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInside = Object.values(menuRefs.current).some(
        (ref) => ref && ref.contains(event.target as Node)
      )
      if (!clickedInside) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = (email: string) => {
    setOpenMenu(openMenu === email ? null : email)
  }

  return (
    <section className="rounded-3xl border border-gray-200/50 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-800/50 dark:bg-[#0d1220]/80 transition-all duration-300">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Team Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Invite members and manage organization roles
          </p>
        </div>
        <button
          className="relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:rounded-full before:bg-white/10 before:opacity-0 hover:before:opacity-20 before:transition-opacity"
        >
          Invite Member
        </button>
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {members.map((member) => (
          <article
            key={member.email}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white/80 px-5 py-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 dark:border-gray-800/60 dark:bg-[#11192d]/80 dark:hover:bg-[#1a2035]"
          >
            {/* Avatar + User Info */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium dark:bg-gray-700 dark:text-gray-200">
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {member.name}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {member.email}
                </p>
              </div>
            </div>

            {/* Role Badge + Dropdown */}
            <div className="relative flex items-center gap-3" ref={(el) => (menuRefs.current[member.email] = el)}>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  member.role === 'Owner'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm'
                    : member.role === 'Admin'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'
                } transition-all duration-200`}
              >
                {member.role}
              </span>

              {/* Three-dot menu */}
              <button
                onClick={() => toggleMenu(member.email)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#1b2236] transition"
              >
                <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>

              {/* Dropdown */}
              {openMenu === member.email && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#11192d] z-10">
                  <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1b2236] transition">
                    <PencilIcon className="h-4 w-4" /> Edit
                  </button>
                  <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition">
                    <Trash2Icon className="h-4 w-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
