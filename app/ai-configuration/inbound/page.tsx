'use client'

import { useState } from 'react'
import { InboundIcon, WhatsAppIcon, VoiceIcon, SMSIcon, EmailIcon } from '@/app/components/dashboard/PulseIcons'

type BehaviourToggle = {
  id: string
  label: string
  description: string
  enabled: boolean
}

type Channel = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  connected: boolean
  numberLabel: string
  numberValue: string
  badge?: string
}

export default function InboundPage() {
  const [behaviours, setBehaviours] = useState<BehaviourToggle[]>([
    { id: 'book_appointments', label: 'Book appointments', description: 'Agent can offer and confirm appointment slots using your booking link', enabled: true },
    { id: 'answer_faqs', label: 'Answer FAQs', description: 'Responds to questions about hours, doctors, services, pricing, and location', enabled: true },
    { id: 'human_handoff', label: 'Human handoff', description: 'Escalate to staff when the patient requests it or query is outside agent scope', enabled: true },
    { id: 'collect_leads', label: 'Collect lead details', description: 'Capture name, phone, and reason for visit if patient does not book immediately', enabled: true },
    { id: 'after_hours', label: 'After-hours auto-reply', description: 'When clinic is closed, agent acknowledges and offers to collect details for next day callback', enabled: false },
  ])

  const [channels, setChannels] = useState<Channel[]>([
    { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, color: '#22D3A8', connected: true, numberLabel: 'WhatsApp Business number', numberValue: '+91 98765 43210', badge: 'shared' },
    { id: 'voice', label: 'Voice calls', icon: VoiceIcon, color: '#4F7EFF', connected: true, numberLabel: 'Inbound call number', numberValue: '+91 33 4567 8901', badge: 'shared' },
    { id: 'sms', label: 'SMS', icon: SMSIcon, color: '#A78BFA', connected: false, numberLabel: 'SMS number', numberValue: '' },
    { id: 'email', label: 'Email', icon: EmailIcon, color: '#F5A623', connected: false, numberLabel: 'Inbox address', numberValue: '' },
  ])

  const [greeting, setGreeting] = useState(
    "Hi, I'm Priya from City Dental! 😊 How can I help you today? Are you looking to book an appointment, or do you have a question for us?"
  )
  const [qualifyQuestion, setQualifyQuestion] = useState(
    "Could I ask — is this for yourself or a family member? And would you prefer a morning or afternoon slot?"
  )
  const [handoffNote, setHandoffNote] = useState(
    "One moment, let me connect you with our team who can assist you better."
  )

  const toggleBehaviour = (id: string) =>
    setBehaviours(prev => prev.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b))

  const toggleChannel = (id: string) =>
    setChannels(prev => prev.map(c => c.id === id ? { ...c, connected: !c.connected } : c))

  const updateChannelNumber = (id: string, value: string) =>
    setChannels(prev => prev.map(c => c.id === id ? { ...c, numberValue: value } : c))

  const activeChannels = channels.filter(c => c.connected)

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-6 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-[#E8EBF2]">Inbound</div>
          <div className="text-[11px] text-[#555D72]">Handle patient-initiated contacts across all channels</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#22d3a840] bg-[#22d3a810] text-[#22D3A8] text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> Active
          </div>
          <button className="pulse-btn pulse-btn-primary ml-2">Save changes</button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4 pb-24 overflow-y-auto">

        {/* INBOUND BEHAVIOUR */}
        <div className="pulse-card">
          <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22d3a815] flex items-center justify-center shrink-0">
              <InboundIcon className="w-4 h-4 text-[#22D3A8]" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-[#E8EBF2]">Inbound behaviour</div>
              <div className="text-[11px] text-[#555D72]">What the agent does when a patient reaches out first</div>
            </div>
          </div>
          <div className="divide-y divide-[#ffffff06]">
            {behaviours.map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#ffffff02] transition">
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[#E8EBF2]">{b.label}</div>
                  <div className="text-[11px] text-[#555D72] mt-0.5">{b.description}</div>
                </div>
                <button
                  onClick={() => toggleBehaviour(b.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${b.enabled ? 'bg-[#4F7EFF]' : 'bg-[#1E2433]'}`}
                >
                  <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${b.enabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COMMUNICATION CHANNELS */}
        <div>
          <div className="text-[10px] font-medium text-[#555D72] uppercase tracking-[0.08em] px-1 pb-2">Communication channels</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {channels.map(ch => {
              const Icon = ch.icon
              return (
                <div key={ch.id} className="pulse-card p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ch.color}18` }}>
                      <Icon className="w-4 h-4" style={{ color: ch.color } as any} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-[#E8EBF2]">{ch.label}</div>
                      <div className="text-[11px] font-medium" style={{ color: ch.connected ? ch.color : '#555D72' }}>
                        {ch.connected ? 'Connected' : 'Not connected'}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleChannel(ch.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${ch.connected ? 'bg-[#4F7EFF]' : 'bg-[#1E2433]'}`}
                    >
                      <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${ch.connected ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  {ch.connected && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-medium text-[#8B92A8]">{ch.numberLabel}</label>
                        {ch.badge && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded border border-[#4f7eff40] text-[#4F7EFF] bg-[#4f7eff0a] uppercase tracking-wide">{ch.badge}</span>
                        )}
                      </div>
                      <input
                        className="pulse-input"
                        value={ch.numberValue}
                        onChange={e => updateChannelNumber(ch.id, e.target.value)}
                        placeholder={`Enter ${ch.numberLabel.toLowerCase()}`}
                      />
                    </div>
                  )}

                  {!ch.connected && (
                    <button className="pulse-btn pulse-btn-ghost w-full justify-center text-[12px]">
                      Connect {ch.label}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* CONVERSATION SCRIPTS */}
        <div className="pulse-card">
          <div className="px-5 py-4 border-b border-[#ffffff0f]">
            <div className="text-[14px] font-medium text-[#E8EBF2]">Conversation script</div>
            <div className="text-[11px] text-[#555D72] mt-0.5">The templates the agent uses at key moments of the inbound flow</div>
          </div>
          <div className="p-5 grid lg:grid-cols-3 gap-4">
            {[
              { label: 'Greeting message', state: greeting, setState: setGreeting, color: '#22D3A8', hint: 'First message sent when a patient texts in.' },
              { label: 'Qualifying question', state: qualifyQuestion, setState: setQualifyQuestion, color: '#A78BFA', hint: 'Second message to understand intent.' },
              { label: 'Handoff message', state: handoffNote, setState: setHandoffNote, color: '#F5A623', hint: 'Used when escalating to a human.' },
            ].map(({ label, state, setState, color, hint }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium" style={{ color }}>{label}</label>
                <textarea
                  className="pulse-input min-h-[100px] resize-none"
                  value={state}
                  onChange={e => setState(e.target.value)}
                />
                <span className="text-[10px] text-[#555D72]">{hint}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SAVE BAR */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-[240px] h-[64px] bg-[#111520] border-t border-[#ffffff0f] flex items-center justify-between px-7 z-[60]">
        <span className="text-[12px] text-[#555D72]">Settings apply to all active channels immediately on save.</span>
        <div className="flex gap-2">
          <button className="pulse-btn pulse-btn-ghost">Discard</button>
          <button className="pulse-btn pulse-btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  )
}
