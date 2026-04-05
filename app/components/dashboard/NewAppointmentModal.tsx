'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { LeadChannel, Lead } from '@/lib/supabase/types'

type NewAppointmentModalProps = {
  orgId: string
  userId: string
  initialLead?: Lead | null
  onClose: () => void
  onCreated: () => void
}

export default function NewAppointmentModal({ orgId, userId, initialLead, onClose, onCreated }: NewAppointmentModalProps) {
  const [name, setName] = useState(initialLead?.name || '')
  const [phone, setPhone] = useState(initialLead?.phone || '')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(initialLead?.id || null)
  
  const [doctor, setDoctor] = useState('Dr. Mehta')
  const [channel, setChannel] = useState<LeadChannel>('whatsapp')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Lead[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search leads when name changes
  useEffect(() => {
    if (!name.trim() || selectedLeadId) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      const { data } = await (supabase.from('leads') as any)
        .select('*')
        .eq('organization_id', orgId)
        .or(`name.ilike.%${name}%,phone.ilike.%${name}%`)
        .limit(5)
      
      if (data && data.length > 0) {
        setSearchResults(data)
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [name, orgId, selectedLeadId])

  const handleSelectLead = (lead: Lead) => {
    setName(lead.name)
    setPhone(lead.phone || '')
    setSelectedLeadId(lead.id)
    setShowResults(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !date || !time) { setError('Name, date and time are required.'); return }
    setSaving(true); setError('')
    
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString()
      let leadId = selectedLeadId

      // Step 1: Ensure lead exists
      if (!leadId) {
        const { data: leadData, error: leadErr } = await (supabase.from('leads') as any)
          .upsert(
            {
              organization_id: orgId,
              created_by: userId,
              name: name.trim(),
              phone: phone.trim() || null,
              source: 'website',              
              reason: 'Appointment booked',
              status: 'booked',             
              follow_up_enrolled: false,    
            },
            { onConflict: 'organization_id,phone' }
          )
          .select('id')
          .single()
        
        if (leadErr) throw leadErr
        leadId = leadData.id
      } else {
        // Update existing lead status to "booked"
        await (supabase.from('leads') as any)
          .update({ status: 'booked', follow_up_enrolled: false })
          .eq('id', leadId)
      }

      // Step 2: Create appointment
      const { error: apptErr } = await (supabase.from('appointments') as any).insert({
        organization_id: orgId,
        created_by: userId,
        lead_id: leadId,
        patient_name: name.trim(),
        patient_phone: phone.trim() || null,
        doctor: doctor || null,
        channel,
        scheduled_at: scheduledAt,
        status: 'confirmed',
        confirmation_sent: true,
      })
      if (apptErr) throw apptErr

      onCreated()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment.')
    } finally { setSaving(false) }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[440px] bg-[#111520] border border-[#ffffff14] rounded-2xl shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffffff0f]">
          <div>
            <div className="text-[15px] font-semibold text-[#E8EBF2]">New appointment</div>
            <div className="text-[11px] text-[#555D72] mt-0.5">Link to a lead and book a slot</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#555D72] hover:text-[#E8EBF2] hover:bg-[#ffffff0a] transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 14 14"><path d="M1 13L13 1M1 1l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {/* PATIENT SEARCH / NAME */}
          <div className="relative" ref={searchRef}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">Patient name <span className="text-[#FF6B6B]">*</span></label>
              <div className="relative">
                <input 
                  className="pulse-input pr-10" 
                  placeholder="Seach by name or phone..." 
                  value={name} 
                  onChange={e => {
                    setName(e.target.value)
                    if (selectedLeadId) setSelectedLeadId(null) // Reset selection if typing
                  }}
                  autoFocus 
                />
                {selectedLeadId && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#22D3A8] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-[#0A0D12]" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </div>
            </div>

            {/* SEARCH RESULTS DROPDOWN */}
            {showResults && !selectedLeadId && (
              <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#171C28] border border-[#ffffff14] rounded-xl shadow-2xl z-10 py-1 overflow-hidden">
                <div className="px-3 py-1.5 border-b border-[#ffffff08] text-[9px] font-bold text-[#555D72] uppercase tracking-wider">Matching Leads</div>
                {searchResults.map(lead => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => handleSelectLead(lead)}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#ffffff05] transition flex items-center gap-3 group"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#4F7EFF] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#E8EBF2] truncate">{lead.name}</div>
                      <div className="text-[10px] text-[#555D72]">{lead.phone || 'No phone'}</div>
                    </div>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#ffffff0a] text-[#8B92A8] capitalize">{lead.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#8B92A8]">Phone</label>
            <input 
              className="pulse-input" 
              placeholder="+91 98765 43210" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              type="tel"
              disabled={!!selectedLeadId} // Lockdown if searching lead
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">Doctor</label>
              <select className="pulse-input appearance-none" value={doctor} onChange={e => setDoctor(e.target.value)}>
                <option>Dr. Mehta</option>
                <option>Dr. Shah</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">Channel</label>
              <select className="pulse-input appearance-none" value={channel} onChange={e => setChannel(e.target.value as LeadChannel)}>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="voice">Voice</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">Date <span className="text-[#FF6B6B]">*</span></label>
              <input className="pulse-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">Time <span className="text-[#FF6B6B]">*</span></label>
              <input className="pulse-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#22d3a80a] border border-[#22d3a820] rounded-xl mt-1">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#E8EBF2]">Send confirmation message</div>
              <div className="text-[10px] text-[#555D72] mt-0.5">Agent will send a confirmation via {channel}</div>
            </div>
            <div className="relative w-11 h-6 rounded-full bg-[#4F7EFF] shrink-0">
              <span className="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow translate-x-5" />
            </div>
          </div>

          {error && <div className="text-[12px] text-[#FF6B6B] bg-[#ff6b6b10] border border-[#ff6b6b30] rounded-lg px-3 py-2">{error}</div>}
          
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="pulse-btn pulse-btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="pulse-btn pulse-btn-primary flex-1 justify-center">
              {saving ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : 'Book appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
