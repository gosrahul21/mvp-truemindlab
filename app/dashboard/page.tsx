'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  CoreAgentIcon, 
  LeadsIcon, 
  AppointmentsIcon, 
  PlusIcon 
} from '../components/dashboard/PulseIcons'
import CreateLeadModal from '../components/dashboard/CreateLeadModal'
import { supabase } from '@/lib/supabase/client'
import { Lead, Appointment, Review } from '@/lib/supabase/types'

type Stat = {
  title: string
  value: string
  label: string
}

type ActivityItem = {
  id: string
  type: 'sms' | 'email' | 'call' | 'lead' | 'appointment'
  title: string
  timeAgo: string
  status: string
  created_at: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function DashboardPage() {
  const [showCreateLead, setShowCreateLead] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [stats, setStats] = useState<Stat[]>([
    { title: '0', value: 'This month', label: 'Leads' },
    { title: '0%', value: 'Resolved', label: 'Conversion' },
    { title: '0.0', value: 'Avg rating', label: 'Rating' },
  ])
  const [activity, setActivity] = useState<ActivityItem[]>([])

  const [agentStatus, setAgentStatus] = useState({ inbound: false, outbound: false })

  // Get Org ID
  useEffect(() => {
    async function getOrg() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await (supabase.from('organization_members') as any)
        .select('organization_id')
        .eq('user_id', user.id)
        .single()
      if (data) setOrgId(data.organization_id)
    }
    getOrg()
  }, [])

  const fetchData = useCallback(async () => {
    if (!orgId) return
    setLoading(true)

    try {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      // 0. Agent Status
      const { data: agents } = await (supabase.from('organization_agents') as any)
        .select('agent_type, is_active')
        .eq('organization_id', orgId)
      
      const status = { inbound: false, outbound: false }
      agents?.forEach((a: any) => {
        if (a.agent_type === 'inbound' && a.is_active) status.inbound = true
        if (a.agent_type === 'outbound' && a.is_active) status.outbound = true
      })
      setAgentStatus(status)

      // 1. Stats: Leads this month
      const { count: monthLeads } = await (supabase.from('leads') as any)
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .gte('created_at', startOfMonth.toISOString())

      // 2. Stats: Conversion (Booked / Total)
      const { count: totalLeads } = await (supabase.from('leads') as any)
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
      
      const { count: bookedLeads } = await (supabase.from('leads') as any)
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .eq('status', 'booked')

      const conversion = totalLeads && totalLeads > 0 
        ? Math.round(((bookedLeads || 0) / totalLeads) * 100) 
        : 0

      // 3. Stats: Avg Rating
      const { data: reviews } = await (supabase.from('reviews') as any)
        .select('rating')
        .eq('organization_id', orgId)
      
      const avgRating = reviews && reviews.length > 0
        ? (reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0'

      setStats([
        { title: (monthLeads || 0).toString(), value: 'This month', label: 'Leads' },
        { title: `${conversion}%`, value: 'Resolved', label: 'Conversion' },
        { title: avgRating, value: 'Avg rating', label: 'Rating' },
      ])

      // 4. Activity Feed
      const [leadsRes, apptsRes] = await Promise.all([
        (supabase.from('leads') as any)
          .select('id, name, created_at, status')
          .eq('organization_id', orgId)
          .order('created_at', { ascending: false })
          .limit(5),
        (supabase.from('appointments') as any)
          .select('id, patient_name, created_at, status')
          .eq('organization_id', orgId)
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      const leadActivities: ActivityItem[] = (leadsRes.data || []).map((l: any) => ({
        id: l.id,
        type: 'lead',
        title: `New lead added: ${l.name}`,
        timeAgo: timeAgo(l.created_at),
        status: l.status === 'new' ? 'Pending' : 'Delivered',
        created_at: l.created_at
      }))

      const apptActivities: ActivityItem[] = (apptsRes.data || []).map((a: any) => ({
        id: a.id,
        type: 'appointment',
        title: `Appointment ${a.status}: ${a.patient_name}`,
        timeAgo: timeAgo(a.created_at),
        status: a.status === 'confirmed' ? 'Delivered' : 'Pending',
        created_at: a.created_at
      }))

      const combined = [...leadActivities, ...apptActivities]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)

      setActivity(combined)

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLeadCreated = (lead: { name: string }) => {
    setShowCreateLead(false)
    fetchData() // Refresh everything
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="pulse-btn pulse-btn-ghost">View all analytics</button>
          <button
            className="pulse-btn pulse-btn-primary"
            onClick={() => setShowCreateLead(true)}
          >
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
              <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-opacity ${
                agentStatus.inbound ? 'border-[#22d3a840] bg-[#22d3a810] text-[#22D3A8]' : 'border-[#ffffff10] bg-[#ffffff05] text-[#555D72] opacity-50'
              }`}>
                <span className={`w-1 h-1 rounded-full bg-current ${agentStatus.inbound ? 'animate-pulse' : ''}`} /> Inbound {agentStatus.inbound ? 'active' : 'inactive'}
              </span>
              <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-opacity ${
                agentStatus.outbound ? 'border-[#a78bfa40] bg-[#a78bfa10] text-[#A78BFA]' : 'border-[#ffffff10] bg-[#ffffff05] text-[#555D72] opacity-50'
              }`}>
                <span className={`w-1 h-1 rounded-full bg-current ${agentStatus.outbound ? 'animate-pulse' : ''}`} /> Follow-ups {agentStatus.outbound ? 'running' : 'stopped'}
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
              <div className="w-8 h-8 rounded-lg bg-[#a78bfa1f] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#A78BFA]" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-[#E8EBF2]">Recent Activity</div>
                <div className="text-[11px] text-[#555D72]">Real-time updates from your AI agent</div>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-2 min-h-[300px]">
              {loading && (
                 <div className="flex flex-col gap-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="bg-[#171C28] border border-[#ffffff0f] rounded-lg p-4 animate-pulse h-[60px]" />
                    ))}
                 </div>
              )}
              {!loading && activity.length === 0 && (
                <div className="flex items-center justify-center h-full text-[#555D72] text-[12px] italic py-10">
                  No recent activity found.
                </div>
              )}
              {!loading && activity.map((item) => (
                <div key={item.id} className="bg-[#171C28] border border-[#ffffff0f] rounded-lg p-3 flex items-center gap-3 hover:border-[#ffffff1f] transition">
                  <div className="w-9 h-9 rounded-lg bg-[#ffffff0a] flex items-center justify-center text-[10px] font-bold text-[#8B92A8] uppercase">
                    {item.type.substring(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#E8EBF2] truncate">{item.title}</div>
                    <div className="text-[11px] text-[#555D72]">{item.timeAgo}</div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium ${
                    item.status === 'Delivered' ? 'bg-[#22d3a80f] text-[#22D3A8]' : 'bg-[#f5a6230f] text-[#F5A623]'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> {item.status}
                  </div>
                </div>
              ))}
              {!loading && activity.length > 0 && (
                <button className="flex items-center justify-center gap-2 mt-2 p-2 border border-dashed border-[#ffffff1f] rounded-lg text-[#555D72] text-[12px] hover:text-[#8B92A8] hover:border-[#ffffff3f] transition">
                  View audit log
                </button>
              )}
            </div>
          </div>

          {/* CHANNELS STATUS */}
          <div className="pulse-card">
            <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#22d3a81a] flex items-center justify-center shrink-0">
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

        {/* QUICK ACTIONS */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Bulk Campaign', desc: 'Reach 100+ patients', icon: <PlusIcon className="w-3.5 h-3.5" />, onClick: () => {} },
            { label: 'New Lead', desc: 'Manual lead entry', icon: <LeadsIcon className="w-3.5 h-3.5" />, onClick: () => setShowCreateLead(true) },
            { label: 'Bookings', desc: 'Sync calendar', icon: <AppointmentsIcon className="w-3.5 h-3.5" />, onClick: () => {} },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="pulse-card p-5 text-left hover:bg-[#171C28] transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#ffffff0a] flex items-center justify-center text-[#555D72] group-hover:text-[#4F7EFF] group-hover:bg-[#4f7eff1a] transition mb-3">
                {action.icon}
              </div>
              <div className="text-[13px] font-medium text-[#E8EBF2]">{action.label}</div>
              <div className="text-[11px] text-[#555D72] mt-0.5">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CREATE LEAD MODAL */}
      {showCreateLead && (
        <CreateLeadModal
          onClose={() => setShowCreateLead(false)}
          onCreated={handleLeadCreated}
        />
      )}
    </div>
  )
}
