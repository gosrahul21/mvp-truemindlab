'use client'

import { useState } from 'react'
import { CampaignIcon, PlusIcon, WhatsAppIcon, SMSIcon, EmailIcon } from '@/app/components/dashboard/PulseIcons'

type Campaign = {
  id: string
  name: string
  channel: 'whatsapp' | 'sms' | 'email'
  status: 'draft' | 'running' | 'paused' | 'completed'
  audience: string
  sent: number
  opened: number
}

const demoCampaigns: Campaign[] = [
  { id: '1', name: 'Monsoon Dental Check-up Offer', channel: 'whatsapp', status: 'running', audience: 'All inactive leads (180 days)', sent: 312, opened: 198 },
  { id: '2', name: 'Teeth Whitening – Limited Slots', channel: 'sms', status: 'completed', audience: 'Visited before, no treatment', sent: 95, opened: 61 },
  { id: '3', name: 'Children Dental Camp Reminder', channel: 'email', status: 'draft', audience: 'Parents segment', sent: 0, opened: 0 },
]

const channelConfig = {
  whatsapp: { icon: WhatsAppIcon, color: '#22D3A8' },
  sms: { icon: SMSIcon, color: '#A78BFA' },
  email: { icon: EmailIcon, color: '#F5A623' },
}

const statusConfig = {
  draft: { label: 'Draft', color: '#555D72', bg: '#ffffff0a' },
  running: { label: 'Running', color: '#22D3A8', bg: '#22d3a810' },
  paused: { label: 'Paused', color: '#F5A623', bg: '#f5a62310' },
  completed: { label: 'Completed', color: '#8B92A8', bg: '#ffffff0a' },
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(demoCampaigns)
  const [showComposer, setShowComposer] = useState(false)

  // New campaign form
  const [newName, setNewName] = useState('')
  const [newChannel, setNewChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp')
  const [newMessage, setNewMessage] = useState('')
  const [newAudience, setNewAudience] = useState('All leads')

  const handleCreate = () => {
    if (!newName.trim()) return
    const id = String(Date.now())
    setCampaigns(prev => [...prev, {
      id, name: newName, channel: newChannel, status: 'draft',
      audience: newAudience, sent: 0, opened: 0
    }])
    setNewName(''); setNewMessage(''); setShowComposer(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Campaigns</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowComposer(v => !v)} className="pulse-btn pulse-btn-primary">
            <PlusIcon className="w-3 h-3 mr-1" /> New campaign
          </button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-5 overflow-y-auto">
        {/* HERO */}
        <div className="pulse-card p-6 flex items-center gap-5 relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(245,166,35,0.08)_0%,transparent_70%)] pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5A623] to-[#FF6B6B] flex items-center justify-center shrink-0 shadow-lg shadow-[#f5a6231a]">
            <CampaignIcon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-['Fraunces'] text-[22px] font-normal text-[#E8EBF2] tracking-[-0.02em]">
              Broadcast <em>campaigns</em>
            </div>
            <div className="text-[12px] text-[#555D72] mt-1">Send proactive messages to segments of your patient list.</div>
          </div>
          <div className="flex gap-2">
            <div className="bg-[#171C28] border border-[#ffffff0f] rounded-lg px-4 py-2 min-w-[80px] flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#E8EBF2]">{campaigns.length}</span>
              <span className="text-[10px] text-[#555D72]">Total</span>
            </div>
            <div className="bg-[#171C28] border border-[#ffffff0f] rounded-lg px-4 py-2 min-w-[80px] flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#22D3A8]">{campaigns.filter(c => c.status === 'running').length}</span>
              <span className="text-[10px] text-[#555D72]">Running</span>
            </div>
          </div>
        </div>

        {/* COMPOSER */}
        {showComposer && (
          <div className="pulse-card animate-in slide-in-from-top-2 duration-300">
            <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center justify-between">
              <div className="text-[14px] font-medium text-[#E8EBF2]">New campaign</div>
              <button onClick={() => setShowComposer(false)} className="text-[#555D72] hover:text-[#8B92A8] text-[12px] transition">Cancel</button>
            </div>
            <div className="p-5 grid lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Campaign name</label>
                  <input className="pulse-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Diwali Offer Blast" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Channel</label>
                  <select className="pulse-input appearance-none" value={newChannel} onChange={e => setNewChannel(e.target.value as any)}>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Audience</label>
                  <select className="pulse-input appearance-none" value={newAudience} onChange={e => setNewAudience(e.target.value)}>
                    <option>All leads</option>
                    <option>Leads from last 30 days</option>
                    <option>Inactive leads (90+ days)</option>
                    <option>Leads who never booked</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Message</label>
                <textarea
                  className="pulse-input flex-1 min-h-[140px] resize-none font-mono text-[12px]"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder={`Hi {name}, special offer at City Dental this month...`}
                />
                <span className="text-[10px] text-[#555D72]">Variables: {`{name}, {clinic}, {link}, {doctor}`}</span>
              </div>
            </div>
            <div className="px-5 pb-5 flex justify-end gap-2">
              <button className="pulse-btn pulse-btn-ghost">Save as draft</button>
              <button onClick={handleCreate} className="pulse-btn pulse-btn-primary">Create campaign</button>
            </div>
          </div>
        )}

        {/* CAMPAIGNS LIST */}
        <div className="pulse-card">
          <div className="px-5 py-4 border-b border-[#ffffff0f]">
            <div className="text-[14px] font-medium text-[#E8EBF2]">All campaigns</div>
          </div>
          <div className="divide-y divide-[#ffffff08]">
            {campaigns.map(campaign => {
              const ch = channelConfig[campaign.channel]
              const st = statusConfig[campaign.status]
              const Icon = ch.icon
              const openRate = campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0

              return (
                <div key={campaign.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[#ffffff03] transition">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ch.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: ch.color } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#E8EBF2] truncate">{campaign.name}</div>
                    <div className="text-[11px] text-[#555D72] mt-0.5">{campaign.audience}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-[12px]">
                    <div className="text-center">
                      <div className="font-medium text-[#E8EBF2]">{campaign.sent.toLocaleString()}</div>
                      <div className="text-[10px] text-[#555D72]">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium" style={{ color: openRate > 50 ? '#22D3A8' : '#8B92A8' }}>{campaign.sent > 0 ? `${openRate}%` : '—'}</div>
                      <div className="text-[10px] text-[#555D72]">Opened</div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ color: st.color, background: st.bg }}>
                    {st.label}
                  </div>
                  <button className="text-[#555D72] hover:text-[#8B92A8] transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
                  </button>
                </div>
              )
            })}

            {campaigns.length === 0 && (
              <div className="p-12 text-center text-[#555D72] text-[12px]">No campaigns yet. Click "New campaign" to create your first.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
