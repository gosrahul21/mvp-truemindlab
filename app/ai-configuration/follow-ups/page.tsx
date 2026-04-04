'use client'

import { useState } from 'react'
import { FollowUpIcon, WhatsAppIcon, VoiceIcon, SMSIcon, EmailIcon } from '@/app/components/dashboard/PulseIcons'

type TriggerRule = {
  id: string
  label: string
  description: string
  enabled: boolean
}

type Channel = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  enabled: boolean
  tag: string
  tagColor: string
  numberLabel: string
  numberValue: string
  note: string
}

export default function FollowUpsPage() {
  const [triggers, setTriggers] = useState<TriggerRule[]>([
    { id: 'missed_inbound', label: 'Missed inbound — no booking', description: 'Patient contacted but left without booking an appointment', enabled: true },
    { id: 'no_show', label: "No-show appointment", description: "Patient had a confirmed appointment but didn't show up", enabled: true },
    { id: 'no_response', label: 'Inquiry with no response', description: 'Agent sent a reply but patient went silent for 24+ hours', enabled: true },
  ])

  const [maxAttempts, setMaxAttempts] = useState('2')
  const [firstFollowUp, setFirstFollowUp] = useState('4 hours')
  const [secondAttempt, setSecondAttempt] = useState('24 hours')
  const [sendWindow, setSendWindow] = useState('9 AM – 7 PM only')
  const [onNoResponse, setOnNoResponse] = useState('Mark as unresponsive, stop')

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, color: '#22D3A8', enabled: true,
      tag: 'Uses clinic default', tagColor: '#22D3A8',
      numberLabel: 'Number', numberValue: '+91 98765 43210',
      note: 'WhatsApp uses the clinic default. Follow-up messages sent as approved templates.',
    },
    {
      id: 'voice', label: 'Voice calls', icon: VoiceIcon, color: '#4F7EFF', enabled: true,
      tag: 'Dedicated number', tagColor: '#F5A623',
      numberLabel: 'Outbound call number', numberValue: '+91 22 4567 8902',
      note: 'Using a separate number keeps your main inbound line clean.',
    },
    {
      id: 'sms', label: 'SMS', icon: SMSIcon, color: '#A78BFA', enabled: true,
      tag: 'Uses clinic default', tagColor: '#22D3A8',
      numberLabel: 'SMS number', numberValue: '+91 98765 43210',
      note: 'SMS messages are sent from the shared clinic number.',
    },
    {
      id: 'email', label: 'Email', icon: EmailIcon, color: '#F5A623', enabled: false,
      tag: 'Disabled', tagColor: '#555D72',
      numberLabel: 'Inbox address', numberValue: '',
      note: 'Enable and connect an email address to send follow-ups via email.',
    },
  ])

  const [templates, setTemplates] = useState([
    { id: 't1', attempt: '1st attempt', delay: '4 hours after trigger', channel: 'whatsapp', message: "Hi {name}, just following up on your enquiry at City Dental! We'd love to find a slot for you. Want to check availability? 😊" },
    { id: 't2', attempt: '2nd attempt', delay: '24 hours after 1st', channel: 'sms', message: "Hi {name}, still looking for a dentist? City Dental has slots open this week. Reply YES to book or STOP to opt out." },
  ])

  const toggleTrigger = (id: string) =>
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t))

  const toggleChannel = (id: string) =>
    setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c))

  const updateChannelNumber = (id: string, value: string) =>
    setChannels(prev => prev.map(c => c.id === id ? { ...c, numberValue: value } : c))

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-6 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-[#E8EBF2]">Follow-ups</div>
          <div className="text-[11px] text-[#555D72]">Re-engage patients who didn't book or missed their appointment</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#22d3a840] bg-[#22d3a810] text-[#22D3A8] text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> Active
          </div>
          <button className="pulse-btn pulse-btn-primary ml-2">Save changes</button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4 pb-24 overflow-y-auto">

        {/* TRIGGER RULES + CADENCE - Two column */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Trigger Rules */}
          <div className="pulse-card">
            <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#a78bfa15] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#A78BFA]" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-[14px] font-medium text-[#E8EBF2]">Trigger rules</div>
                <div className="text-[11px] text-[#555D72]">When does follow-up fire?</div>
              </div>
            </div>
            <div className="divide-y divide-[#ffffff06]">
              {triggers.map(t => (
                <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#ffffff02] transition">
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-[#E8EBF2]">{t.label}</div>
                    <div className="text-[11px] text-[#555D72] mt-0.5">{t.description}</div>
                  </div>
                  <button
                    onClick={() => toggleTrigger(t.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${t.enabled ? 'bg-[#4F7EFF]' : 'bg-[#1E2433]'}`}
                  >
                    <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${t.enabled ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Cadence */}
          <div className="pulse-card">
            <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4f7eff15] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#4F7EFF]" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8A6 6 0 112 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M14 8l-2-2M14 8l-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-[14px] font-medium text-[#E8EBF2]">Follow-up cadence</div>
                <div className="text-[11px] text-[#555D72]">How many attempts, how far apart</div>
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Max attempts</label>
                <select className="pulse-input appearance-none" value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">First follow-up after</label>
                <select className="pulse-input appearance-none" value={firstFollowUp} onChange={e => setFirstFollowUp(e.target.value)}>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>24 hours</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Second attempt after</label>
                <select className="pulse-input appearance-none" value={secondAttempt} onChange={e => setSecondAttempt(e.target.value)}>
                  <option>4 hours</option>
                  <option>12 hours</option>
                  <option>24 hours</option>
                  <option>48 hours</option>
                  <option>3 days</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Send window</label>
                <select className="pulse-input appearance-none" value={sendWindow} onChange={e => setSendWindow(e.target.value)}>
                  <option>Any time</option>
                  <option>9 AM – 7 PM only</option>
                  <option>9 AM – 9 PM only</option>
                  <option>Clinic hours only</option>
                </select>
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">On no response after all attempts</label>
                <select className="pulse-input appearance-none" value={onNoResponse} onChange={e => setOnNoResponse(e.target.value)}>
                  <option>Mark as unresponsive, stop</option>
                  <option>Tag for manual follow-up</option>
                  <option>Move to long-term nurture list</option>
                </select>
              </div>
            </div>
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
                      <div className="text-[10px] font-medium mt-0.5" style={{ color: ch.tagColor }}>{ch.tag}</div>
                    </div>
                    <button
                      onClick={() => toggleChannel(ch.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${ch.enabled ? 'bg-[#4F7EFF]' : 'bg-[#1E2433]'}`}
                    >
                      <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${ch.enabled ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  {ch.enabled && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-medium text-[#8B92A8]">{ch.numberLabel}</label>
                          {ch.tag !== 'Disabled' && (
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wide"
                              style={{ color: ch.tagColor, borderColor: `${ch.tagColor}40`, background: `${ch.tagColor}0f` }}
                            >
                              {ch.tag === 'Uses clinic default' ? 'shared with inbound' : 'dedicated'}
                            </span>
                          )}
                        </div>
                        <input
                          className="pulse-input"
                          value={ch.numberValue}
                          onChange={e => updateChannelNumber(ch.id, e.target.value)}
                          placeholder={`Enter ${ch.numberLabel.toLowerCase()}`}
                        />
                      </div>
                      <div className="text-[10px] text-[#555D72] leading-relaxed">{ch.note}</div>
                    </>
                  )}

                  {!ch.enabled && (
                    <button className="pulse-btn pulse-btn-ghost w-full justify-center text-[12px]">
                      Enable {ch.label}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* MESSAGE TEMPLATES */}
        <div className="pulse-card">
          <div className="px-5 py-4 border-b border-[#ffffff0f]">
            <div className="text-[14px] font-medium text-[#E8EBF2]">Message templates</div>
            <div className="text-[11px] text-[#555D72] mt-0.5">What the agent sends on each follow-up attempt</div>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {templates.map((t, idx) => (
              <div key={t.id} className="flex flex-col gap-2 p-4 bg-[#171C28] border border-[#ffffff0f] rounded-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-[#4F7EFF]">{t.attempt}</span>
                  <span className="text-[10px] text-[#555D72]">·</span>
                  <span className="text-[10px] text-[#555D72]">{t.delay}</span>
                  <span className="ml-auto">
                    <select
                      className="bg-transparent border-none outline-none text-[11px] font-medium text-[#8B92A8] cursor-pointer"
                      value={t.channel}
                      onChange={e => setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, channel: e.target.value } : x))}
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                      <option value="voice">Voice call</option>
                    </select>
                  </span>
                </div>
                <textarea
                  className="pulse-input min-h-[72px] resize-none font-mono text-[12px]"
                  value={t.message}
                  onChange={e => setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, message: e.target.value } : x))}
                />
                <div className="text-[10px] text-[#555D72]">Variables: {`{name}, {clinic}, {link}, {doctor}`}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SAVE BAR */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-[240px] h-[64px] bg-[#111520] border-t border-[#ffffff0f] flex items-center justify-between px-7 z-[60]">
        <span className="text-[12px] text-[#555D72]">Follow-up triggers activate on the next qualifying lead event.</span>
        <div className="flex gap-2">
          <button className="pulse-btn pulse-btn-ghost">Discard</button>
          <button className="pulse-btn pulse-btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  )
}
