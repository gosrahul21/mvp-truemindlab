'use client'

import { useState } from 'react'
import { 
  CoreAgentIcon, 
  LeadsIcon, 
  AppointmentsIcon, 
  PlusIcon 
} from '../components/dashboard/PulseIcons'

type ChangeTone = 'positive' | 'negative' | 'neutral'
type ActivityStatus = 'Delivered' | 'Failed' | 'Pending'

type Stat = {
  title: string
  value: string
  label: string
}

type Activity = {
  id: number
  type: 'sms' | 'email' | 'call' | 'lead'
  title: string
  timeAgo: string
  status: ActivityStatus
}

const stats: Stat[] = [
  { title: '247', value: 'This month', label: 'Leads' },
  { title: '94%', value: 'Resolved', label: 'Conversion' },
  { title: '4.7', value: 'Avg rating', label: 'Rating' },
]

const recentActivity: Activity[] = [
  { id: 1, type: 'lead', title: 'New lead added: Sarah Smith', timeAgo: '2m ago', status: 'Delivered' },
  { id: 2, type: 'sms', title: 'SMS sent to John Doe', timeAgo: '10m ago', status: 'Delivered' },
  { id: 3, type: 'email', title: 'Email opened by Michael', timeAgo: '24m ago', status: 'Pending' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="pulse-btn pulse-btn-ghost">View all analytics</button>
          <button className="pulse-btn pulse-btn-primary">
            <PlusIcon className="w-3 h-3 mr-1" />
            Create Lead
          </button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-5 overflow-y-auto">
        {/* HERO */}
        <div className="pulse-card p-6 flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(79,126,255,0.1)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F7EFF] to-[#7B5FFF] flex items-center justify-center shrink-0 shadow-lg shadow-[#4f7eff1a]">
            <CoreAgentIcon className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1">
            <div className="font-['Fraunces'] text-[22px] font-normal text-[#E8EBF2] tracking-[-0.02em]">
              Your <em>clinic overview</em>
            </div>
            <div className="text-[12px] text-[#555D72] mt-1">Autonomous patient engagement and follow-up performance.</div>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#22d3a840] bg-[#22d3a810] text-[#22D3A8]">
                <span className="w-1 h-1 rounded-full bg-current" /> Inbound active
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#a78bfa40] bg-[#a78bfa10] text-[#A78BFA]">
                <span className="w-1 h-1 rounded-full bg-current" /> Follow-ups running
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#171C28] border border-[#ffffff0f] rounded-lg px-4 py-2 min-w-[90px] flex flex-col items-center">
                <span className="text-[18px] font-bold text-[#E8EBF2] tracking-[-0.02em]">{stat.title}</span>
                <span className="text-[10px] text-[#555D72] mt-0.5">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* RECENT ACTIVITY */}
          <div className="pulse-card">
            <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-lg bg-[#a78bfa1f] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#A78BFA]" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-[#E8EBF2]">Recent Activity</div>
                <div className="text-[11px] text-[#555D72]">Real-time updates from your AI agent</div>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-2">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="bg-[#171C28] border border-[#ffffff0f] rounded-lg p-3 flex items-center gap-3 hover:border-[#ffffff1f] transition">
                  <div className="w-9 h-9 rounded-lg bg-[#ffffff0a] flex items-center justify-center text-[10px] font-bold text-[#8B92A8] uppercase">
                    {activity.type.substring(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#E8EBF2] truncate">{activity.title}</div>
                    <div className="text-[11px] text-[#555D72]">{activity.timeAgo}</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#22d3a80f] text-[#22D3A8] text-[10px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> {activity.status}
                  </div>
                </div>
              ))}
              <button className="flex items-center justify-center gap-2 mt-2 p-2 border border-dashed border-[#ffffff1f] rounded-lg text-[#555D72] text-[12px] hover:text-[#8B92A8] hover:border-[#ffffff3f] transition">
                View audit log
              </button>
            </div>
          </div>

          {/* CHANNELS STATUS */}
          <div className="pulse-card">
            <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-lg bg-[#22d3a81a] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#22D3A8]" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-[#E8EBF2]">Channel Health</div>
                <div className="text-[11px] text-[#555D72]">Status of your communication lines</div>
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {[
                { name: 'WhatsApp', status: 'Live', color: '#22D3A8' },
                { name: 'Voice Calls', status: 'Live', color: '#22D3A8' },
                { name: 'SMS', status: 'Live', color: '#22D3A8' },
                { name: 'Email', status: 'Offline', color: '#555D72' },
              ].map((channel) => (
                <div key={channel.name} className="bg-[#171C28] border border-[#ffffff0f] rounded-lg p-3 flex flex-col gap-2">
                  <div className="text-[12px] font-medium text-[#8B92A8]">{channel.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: channel.color }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> {channel.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Bulk Campaign', desc: 'Reach 100+ patients', icon: <PlusIcon className="w-3.5 h-3.5" /> },
            { label: 'New Lead', desc: 'Manual lead entry', icon: <LeadsIcon className="w-3.5 h-3.5" /> },
            { label: 'Bookings', desc: 'Sync calendar', icon: <AppointmentsIcon className="w-3.5 h-3.5" /> },
          ].map((action) => (
            <button key={action.label} className="pulse-card p-5 text-left hover:bg-[#171C28] transition group">
              <div className="w-8 h-8 rounded-lg bg-[#ffffff0a] flex items-center justify-center text-[#555D72] group-hover:text-[#4F7EFF] group-hover:bg-[#4f7eff1a] transition mb-3">
                {action.icon}
              </div>
              <div className="text-[13px] font-medium text-[#E8EBF2]">{action.label}</div>
              <div className="text-[11px] text-[#555D72] mt-0.5">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
