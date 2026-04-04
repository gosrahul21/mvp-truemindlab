'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { logoutApi } from '@/app/services/api/logout'
import type { UserProfile } from '@/lib/supabase/types'
import { getProfileApi } from '@/app/services/api/profile'
import {
  LogoIcon,
  DashboardIcon,
  LeadsIcon,
  AppointmentsIcon,
  CoreAgentIcon,
  InboundIcon,
  FollowUpIcon,
  CampaignIcon,
  FeedbackIcon,
  SettingsIcon,
  BillingIcon
} from './PulseIcons'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const sections = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
      { label: 'Leads', href: '/dashboard/leads', icon: LeadsIcon, badge: 12 },
      { label: 'Appointments', href: '/dashboard/appointments', icon: AppointmentsIcon },
    ]
  },
  {
    label: 'AI Configuration',
    items: [
      { label: 'Core Agent', href: '/ai-configuration/agents', icon: CoreAgentIcon },
      { label: 'Inbound', href: '/ai-configuration/inbound', icon: InboundIcon },
      { label: 'Follow-ups', href: '/ai-configuration/follow-ups', icon: FollowUpIcon },
      { label: 'Campaigns', href: '/ai-configuration/campaigns', icon: CampaignIcon },
      { label: 'Feedback', href: '/ai-configuration/feedback', icon: FeedbackIcon },
    ]
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Settings', href: '/settings', icon: SettingsIcon },
      { label: 'Billing', href: '/billing', icon: BillingIcon },
    ]
  }
]

export default function AuthSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orgName, setOrgName] = useState('City Dental, Mumbai')

  useEffect(() => {
    async function loadProfile() {
      const { user, profile: userProfile } = await getProfileApi()
      if (userProfile) {
        setProfile(userProfile)
        // In a real app, you'd fetch the org name from the DB/Context
      }
    }
    loadProfile()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await logoutApi()
      if (response.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <aside className="sidebar w-[240px] border-r border-[#ffffff12] bg-[#111520] flex flex-col h-screen fixed left-0 top-0 z-[100]">
      {/* LOGO */}
      <div className="p-5 pb-5 border-b border-[#ffffff12]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#4F7EFF] to-[#7B5FFF] flex items-center justify-center">
            <LogoIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-['Fraunces'] text-[17px] text-[#E8EBF2] tracking-[-0.02em]">
            Pulse <em className="italic text-[#4F7EFF] not-italic">AI</em>
          </span>
        </div>
      </div>

      <div className="mt-3 px-5 text-[10px] text-[#555D72] uppercase font-medium tracking-[0.08em]">Workspace</div>
      <div className="px-5 py-1.5 pb-4 text-[13px] font-medium text-[#8B92A8]">{orgName}</div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-2 pb-1.5 text-[10px] font-medium text-[#555D72] uppercase tracking-[0.08em]">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition group relative ${
                      isActive 
                      ? 'bg-[#4f7eff1f] text-[#4F7EFF] font-medium' 
                      : 'text-[#8B92A8] hover:bg-[#171C28] hover:text-[#E8EBF2]'
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-[#4F7EFF] rounded-r-[3px]" />}
                    <Icon className={`w-4 h-4 shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-[#4F7EFF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-3 border-t border-[#ffffff12]">
        <div 
          onClick={() => router.push('/profile')}
          className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-[#171C28] transition group"
        >
          <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#4F7EFF] to-[#A78BFA] flex items-center justify-center text-[11px] font-bold text-white">
            {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'RC'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-[#E8EBF2] truncate">{profile?.full_name || 'Rahul Goswami'}</div>
            <div className="text-[10px] text-[#555D72]">Admin</div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            className="text-[#555D72] hover:text-white opacity-0 group-hover:opacity-100 transition"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
