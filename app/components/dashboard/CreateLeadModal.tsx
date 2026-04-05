'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type CreateLeadModalProps = {
  onClose: () => void
  onCreated?: (lead: any) => void
}

const sources = ['WhatsApp', 'Facebook Ads', 'Google Ads', 'Website Form', 'Referral', 'Instagram', 'Cold Call', 'Other']
const reasons = ['Teeth cleaning', 'Braces / Orthodontics', 'Implants', 'Root canal', 'Whitening', 'General check-up', 'Other']

export default function CreateLeadModal({ onClose, onCreated }: CreateLeadModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [source, setSource] = useState('WhatsApp')
  const [reason, setReason] = useState('General check-up')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setError('Name and phone are required.')
      return
    }
    setSaving(true)
    setError('')

    try {
      // Get user + org
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: membership } = await (supabase.from('organization_members') as any)
        .select('organization_id')
        .eq('user_id', user.id)
        .single()
      if (!membership) throw new Error('No organization found')

      const { error: insertError } = await (supabase.from('leads') as any).upsert(
        {
          organization_id: membership.organization_id,
          created_by: user.id,
          name: name.trim(),
          phone: phone.trim() || null,
          source: source.toLowerCase().replace(' ', '_'),
          reason: reason || null,
          notes: notes.trim() || null,
          status: 'new',
          follow_up_enrolled: true,
        },
        { onConflict: 'organization_id,phone' } // Prevent duplicates
      )
      if (insertError) throw insertError

      onCreated?.({ name, phone, source, reason, notes })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create lead.')
    } finally {
      setSaving(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <div className="w-full max-w-[480px] bg-[#111520] border border-[#ffffff14] rounded-2xl shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffffff0f]">
          <div>
            <div className="text-[15px] font-semibold text-[#E8EBF2]">New lead</div>
            <div className="text-[11px] text-[#555D72] mt-0.5">Add a patient to the pipeline manually</div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#555D72] hover:text-[#E8EBF2] hover:bg-[#ffffff0a] transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 14 14">
              <path d="M1 13L13 1M1 1l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">
                Patient name <span className="text-[#FF6B6B]">*</span>
              </label>
              <input
                className="pulse-input"
                placeholder="e.g. Ananya Mehta"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">
                Phone number <span className="text-[#FF6B6B]">*</span>
              </label>
              <input
                className="pulse-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                type="tel"
              />
            </div>
          </div>

          {/* Source + Reason */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">Lead source</label>
              <select className="pulse-input appearance-none" value={source} onChange={e => setSource(e.target.value)}>
                {sources.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8B92A8]">Reason for visit</label>
              <select className="pulse-input appearance-none" value={reason} onChange={e => setReason(e.target.value)}>
                {reasons.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#8B92A8]">Notes <span className="text-[#555D72] font-normal">(optional)</span></label>
            <textarea
              className="pulse-input min-h-[72px] resize-none"
              placeholder="Any additional context about this patient…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Start follow-up toggle */}
          <div className="flex items-center gap-3 p-3 bg-[#4f7eff0a] border border-[#4f7eff20] rounded-xl">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#E8EBF2]">Enrol in follow-up sequence</div>
              <div className="text-[10px] text-[#555D72] mt-0.5">
                First message sends <span className="text-[#4F7EFF] font-medium">4 hours after creation</span> — as set in Follow-ups settings. Stops if patient books.
              </div>
            </div>
            <div className="relative w-11 h-6 rounded-full bg-[#4F7EFF] shrink-0">
              <span className="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow translate-x-5" />
            </div>
          </div>

          {error && (
            <div className="text-[12px] text-[#FF6B6B] bg-[#ff6b6b10] border border-[#ff6b6b30] rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="pulse-btn pulse-btn-ghost flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="pulse-btn pulse-btn-primary flex-1 justify-center">
              {saving ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : 'Create lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
