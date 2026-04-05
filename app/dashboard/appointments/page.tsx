'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppointmentsIcon, PlusIcon } from '@/app/components/dashboard/PulseIcons'
import { supabase } from '@/lib/supabase/client'
import { Appointment, AppointmentStatus } from '@/lib/supabase/types'
import NewAppointmentModal from '@/app/components/dashboard/NewAppointmentModal'

const statusConfig: Record<AppointmentStatus, { label: string; color: string; bg: string; border: string }> = {
  confirmed:  { label: 'Confirmed',  color: '#22D3A8', bg: '#22d3a810', border: '#22d3a830' },
  pending:    { label: 'Pending',    color: '#F5A623', bg: '#f5a62310', border: '#f5a62330' },
  completed:  { label: 'Completed',  color: '#4F7EFF', bg: '#4f7eff10', border: '#4f7eff30' },
  no_show:    { label: 'No Show',    color: '#FF6B6B', bg: '#ff6b6b10', border: '#ff6b6b30' },
  cancelled:  { label: 'Cancelled',  color: '#555D72', bg: '#ffffff08', border: '#ffffff15' },
}

const channelColors: Record<string, string> = {
  whatsapp: '#22D3A8', sms: '#A78BFA', voice: '#4F7EFF', email: '#F5A623', website: '#8B92A8',
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

function formatScheduled(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000)

  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 0) return { date: 'Today', time: timeStr }
  if (diffDays === 1) return { date: 'Tomorrow', time: timeStr }
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    time: timeStr
  }
}

type FilterKey = 'All' | AppointmentStatus

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<FilterKey>('All')
  const [search, setSearch] = useState('')
  const [orgId, setOrgId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await (supabase.from('organization_members') as any)
        .select('organization_id').eq('user_id', user.id).single()
      if (data) setOrgId(data.organization_id)
    }
    init()
  }, [])

  const fetchAppointments = useCallback(async () => {
    if (!orgId) return
    setLoading(true)
    const { data, error } = await (supabase.from('appointments') as any)
      .select('*')
      .eq('organization_id', orgId)
      .order('scheduled_at', { ascending: true })
      .limit(100)
    if (!error && data) setAppointments(data as Appointment[])
    setLoading(false)
  }, [orgId])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const counts = {
    All:       appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    no_show:   appointments.filter(a => a.status === 'no_show').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  const todayCount = appointments.filter(a => {
    const d = new Date(a.scheduled_at)
    const t = new Date()
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
  }).length

  const noShowRate = appointments.length > 0
    ? Math.round((counts.no_show / appointments.length) * 100)
    : 0
  const confirmedRate = appointments.length > 0
    ? Math.round((counts.confirmed / appointments.length) * 100)
    : 0

  const filtered = appointments.filter(a => {
    const matchStatus = filter === 'All' || a.status === filter
    const matchSearch = !search ||
      a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      (a.doctor ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Appointments</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="pulse-btn pulse-btn-ghost">View calendar</button>
          <button className="pulse-btn pulse-btn-primary" onClick={() => setShowModal(true)}>
            <PlusIcon className="w-3 h-3 mr-1" />
            New Appointment
          </button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-5 overflow-y-auto">
        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Today's bookings", value: todayCount,      sub: `${counts.All} total`,         subColor: '#4F7EFF' },
            { label: 'No-show rate',     value: `${noShowRate}%`,sub: `${counts.no_show} no-shows`,  subColor: '#FF6B6B' },
            { label: 'Confirmed rate',   value: `${confirmedRate}%`, sub: 'Booking quality',         subColor: '#22D3A8' },
            { label: 'Completed',        value: counts.completed, sub: 'This month',                 subColor: '#4F7EFF' },
          ].map(s => (
            <div key={s.label} className="pulse-card px-5 py-4 flex flex-col gap-1">
              <span className="text-[22px] font-bold text-[#E8EBF2] tracking-[-0.02em]">{s.value}</span>
              <span className="text-[11px] text-[#555D72]">{s.label}</span>
              <span className="text-[10px] font-medium mt-0.5" style={{ color: s.subColor }}>{s.sub}</span>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="pulse-card flex flex-col">
          <div className="px-5 py-3 border-b border-[#ffffff0f] flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              {(['All', 'confirmed', 'pending', 'completed', 'no_show'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s as FilterKey)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition capitalize ${
                    filter === s
                      ? 'bg-[#4f7eff1a] text-[#4F7EFF] border border-[#4f7eff30]'
                      : 'text-[#555D72] hover:text-[#8B92A8] hover:bg-[#ffffff05]'
                  }`}
                >
                  {s === 'All' ? 'All' : statusConfig[s as AppointmentStatus].label}
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
                placeholder="Search patient, doctor…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr_1fr_auto] px-5 py-2.5 text-[10px] font-semibold text-[#555D72] uppercase tracking-[0.07em]">
            <span>Patient</span><span>Doctor</span><span>Channel</span><span>Date</span><span>Time</span><span>Status</span><span />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <svg className="w-6 h-6 animate-spin text-[#4F7EFF]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          )}

          {!loading && (
            <div className="divide-y divide-[#ffffff05]">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <AppointmentsIcon className="w-8 h-8 text-[#555D72] mx-auto mb-3" />
                  <p className="text-[#555D72] text-[13px]">
                    {appointments.length === 0 ? 'No appointments yet. Click "New Appointment" to get started.' : 'No appointments match your filter.'}
                  </p>
                </div>
              ) : filtered.map((appt, idx) => {
                const sc = statusConfig[appt.status]
                const chColor = channelColors[appt.channel] ?? '#8B92A8'
                const { date, time } = formatScheduled(appt.scheduled_at)
                return (
                  <div
                    key={appt.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr_1fr_auto] items-center px-5 py-3.5 hover:bg-[#ffffff02] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                        {initials(appt.patient_name)}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[#E8EBF2]">{appt.patient_name}</div>
                        <div className="text-[10px] text-[#555D72]">{appt.patient_phone ?? '—'}</div>
                      </div>
                    </div>
                    <span className="text-[12px] text-[#8B92A8]">{appt.doctor ?? '—'}</span>
                    <span className="text-[12px] font-medium capitalize" style={{ color: chColor }}>{appt.channel}</span>
                    <span className="text-[12px] text-[#8B92A8]">{date}</span>
                    <span className="text-[12px] font-medium text-[#E8EBF2]">{time}</span>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border" style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />{sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                      <button className="pulse-btn pulse-btn-ghost !py-1 !px-2.5 !text-[11px]">View</button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[#555D72] hover:text-[#FF6B6B] hover:bg-[#ff6b6b0f] transition" title="Mark no-show">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16"><path d="M2 14L14 2M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-[#ffffff06] flex items-center justify-between">
              <span className="text-[11px] text-[#555D72]">Showing {filtered.length} of {appointments.length} appointments</span>
              <button className="text-[11px] text-[#555D72] hover:text-[#4F7EFF] transition">Load more</button>
            </div>
          )}
        </div>
      </div>

      {showModal && orgId && userId && (
        <NewAppointmentModal
          orgId={orgId}
          userId={userId}
          onClose={() => setShowModal(false)}
          onCreated={fetchAppointments}
        />
      )}
    </div>
  )
}
