'use client'

import { useState, useEffect, useCallback } from 'react'
import { PlusIcon, LeadsIcon } from '@/app/components/dashboard/PulseIcons'
import CreateLeadModal from '@/app/components/dashboard/CreateLeadModal'
import { supabase } from '@/lib/supabase/client'
import { Lead, LeadStatus } from '@/lib/supabase/types'

const statusConfig: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: 'New',       color: '#8B92A8', bg: '#ffffff08', border: '#ffffff15' },
  contacted: { label: 'Contacted', color: '#F5A623', bg: '#f5a62310', border: '#f5a62330' },
  qualified: { label: 'Qualified', color: '#4F7EFF', bg: '#4f7eff10', border: '#4f7eff30' },
  booked:    { label: 'Booked',    color: '#22D3A8', bg: '#22d3a810', border: '#22d3a830' },
  lost:      { label: 'Lost',      color: '#FF6B6B', bg: '#ff6b6b10', border: '#ff6b6b30' },
}

const avatarColors = [
  'from-[#4F7EFF] to-[#7B5FFF]',
  'from-[#22D3A8] to-[#4F7EFF]',
  'from-[#F5A623] to-[#FF6B6B]',
  'from-[#A78BFA] to-[#4F7EFF]',
  'from-[#3DD68C] to-[#22D3A8]',
  'from-[#FF6B6B] to-[#A78BFA]',
]

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
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

type FilterKey = 'All' | LeadStatus

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<FilterKey>('All')
  const [search, setSearch] = useState('')
  const [orgId, setOrgId] = useState<string | null>(null)

  // Fetch org ID once
  useEffect(() => {
    async function getOrgId() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await (supabase.from('organization_members') as any)
        .select('organization_id')
        .eq('user_id', user.id)
        .single()
      if (data) setOrgId(data.organization_id)
    }
    getOrgId()
  }, [])

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    if (!orgId) return
    setLoading(true)
    const { data, error } = await (supabase.from('leads') as any)
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(100)
    if (!error && data) setLeads(data as Lead[])
    setLoading(false)
  }, [orgId])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleLeadCreated = (lead: { name: string; phone: string; source: string; reason: string }) => {
    // Optimistic update — re-fetch to sync with DB
    fetchLeads()
  }

  const counts = {
    All:       leads.length,
    new:       leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    booked:    leads.filter(l => l.status === 'booked').length,
    lost:      leads.filter(l => l.status === 'lost').length,
  }

  const filtered = leads.filter(l => {
    const matchStatus = filter === 'All' || l.status === filter
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.phone ?? '').includes(search)
    return matchStatus && matchSearch
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Leads</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="pulse-btn pulse-btn-ghost">Export CSV</button>
          <button className="pulse-btn pulse-btn-primary" onClick={() => setShowModal(true)}>
            <PlusIcon className="w-3 h-3 mr-1" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-5 overflow-y-auto">

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { label: 'Total Leads', value: counts.All,       color: '#4F7EFF' },
            { label: 'New',         value: counts.new,        color: '#8B92A8' },
            { label: 'Qualified',   value: counts.qualified,  color: '#4F7EFF' },
            { label: 'Booked',      value: counts.booked,     color: '#22D3A8' },
          ] as const).map(s => (
            <div key={s.label} className="pulse-card px-5 py-4 flex flex-col gap-1">
              <span className="text-[22px] font-bold text-[#E8EBF2] tracking-[-0.02em]">{s.value}</span>
              <span className="text-[11px] text-[#555D72]">{s.label}</span>
              <div className="h-[2px] rounded-full mt-1 bg-[#ffffff08]">
                <div className="h-[2px] rounded-full transition-all" style={{ background: s.color, width: `${Math.min(counts.All > 0 ? (s.value / counts.All) * 100 : 0, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* TABLE CARD */}
        <div className="pulse-card flex flex-col">
          {/* Filters + Search */}
          <div className="px-5 py-3 border-b border-[#ffffff0f] flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              {(['All', 'new', 'contacted', 'qualified', 'booked', 'lost'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s as FilterKey)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition capitalize ${
                    filter === s
                      ? 'bg-[#4f7eff1a] text-[#4F7EFF] border border-[#4f7eff30]'
                      : 'text-[#555D72] hover:text-[#8B92A8] hover:bg-[#ffffff05]'
                  }`}
                >
                  {s === 'All' ? 'All' : statusConfig[s as LeadStatus].label}
                  <span className="ml-1.5 text-[10px] opacity-60">{counts[s]}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555D72]" fill="none" viewBox="0 0 16 16">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                className="pulse-input !py-1.5 pl-8 !w-[180px] !text-[12px]"
                placeholder="Search leads…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_auto] px-5 py-2.5 text-[10px] font-semibold text-[#555D72] uppercase tracking-[0.07em]">
            <span>Patient</span>
            <span>Source</span>
            <span>Reason</span>
            <span>Stage</span>
            <span>Added</span>
            <span />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <svg className="w-6 h-6 animate-spin text-[#4F7EFF]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          )}

          {/* Rows */}
          {!loading && (
            <div className="divide-y divide-[#ffffff05]">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <LeadsIcon className="w-8 h-8 text-[#555D72] mx-auto mb-3" />
                  <p className="text-[#555D72] text-[13px]">
                    {leads.length === 0 ? 'No leads yet. Click "Add Lead" to get started.' : 'No leads match your filter.'}
                  </p>
                </div>
              ) : (
                filtered.map((lead, idx) => {
                  const cfg = statusConfig[lead.status]
                  return (
                    <div
                      key={lead.id}
                      className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_auto] items-center px-5 py-3.5 hover:bg-[#ffffff02] transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                          {initials(lead.name)}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[#E8EBF2]">{lead.name}</div>
                          <div className="text-[10px] text-[#555D72]">{lead.phone ?? '—'}</div>
                        </div>
                      </div>
                      <span className="text-[12px] text-[#8B92A8] capitalize">{lead.source.replace('_', ' ')}</span>
                      <span className="text-[12px] text-[#8B92A8]">{lead.reason ?? '—'}</span>
                      <div>
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
                          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {cfg.label}
                        </span>
                      </div>
                      <span className="text-[12px] text-[#555D72]">{timeAgo(lead.created_at)}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button className="pulse-btn pulse-btn-ghost !py-1 !px-2.5 !text-[11px]">View</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[#555D72] hover:text-[#4F7EFF] hover:bg-[#4f7eff10] transition" title="Start follow-up">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16"><path d="M14 8A6 6 0 112 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M14 8l-2-2M14 8l-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-[#ffffff06] flex items-center justify-between">
              <span className="text-[11px] text-[#555D72]">Showing {filtered.length} of {leads.length} leads</span>
              <button className="text-[11px] text-[#555D72] hover:text-[#4F7EFF] transition">Load more</button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CreateLeadModal
          onClose={() => setShowModal(false)}
          onCreated={handleLeadCreated}
        />
      )}
    </div>
  )
}
