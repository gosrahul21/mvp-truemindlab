'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import DropdownMenu from '../ui/DropdownMenu'
import { logoutApi } from '@/app/services/api/logout'
import type { UserProfile } from '@/lib/supabase/types'
import { getProfileApi } from '@/app/services/api/profile'

type NavItem = {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  // { label: 'Onboarding', href: '/onboarding' },
  { label: 'Leads', href: '/dashboard/leads' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Pipeline', href: '/dashboard/pipeline' },
  { label: 'Billing', href: '/billing' },
  { label: 'Settings', href: '/settings/communication' },
  { label: 'Referrals', href: '/referrals' },
]

export default function AuthSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { user, profile: userProfile } = await getProfileApi()
      if (user?.email) setEmail(user.email)
      if (userProfile) setProfile(userProfile)
    }
    loadProfile()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await logoutApi()
      
      if (response.ok) {
        router.push('/login')
        router.refresh()
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <aside className="h-full flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
      <div>
        <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-800">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Workspace
          </p>
          <h2 className="mt-1 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-semibold text-transparent dark:from-gray-100 dark:to-gray-400">
            CloseFlow AI
          </h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#0f172a] border-2 text-white shadow-sm dark:border-gray-400 dark:text-gray-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#11192d] dark:hover:text-gray-100'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-[#11192d]">
          
          {/* Avatar + Info */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0 overflow-hidden flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium dark:bg-gray-700 dark:text-gray-200">
              {profile?.imageUrl ? (
                <Image src={profile.imageUrl} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
              ) : (
                profile?.full_name ? profile.full_name.substring(0,2).toUpperCase() : '?'
              )}
            </div>

            {/* Name + Email */}
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {profile?.full_name || 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {/* {email || '...'} */}
              </p>
            </div>
          </div>

          {/* Three-dot dropdown */}
          <DropdownMenu
            trigger={<span className="text-gray-500 dark:text-gray-400 cursor-pointer text-xl font-bold">⋯</span>}
            items={[
              { label: 'Profile', onClick: () => router.push('/profile') },
              { label: 'Settings', onClick: () => router.push('/preferences') },
              { label: 'Logout', onClick: handleLogout },
            ]}
          />
        </div>

      </div>

    </aside>
  )
}
