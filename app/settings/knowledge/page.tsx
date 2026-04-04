'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  Save, 
  Globe, 
  Calendar, 
  MessageSquare, 
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { BillingIcon, ChevronDownIcon, LogoIcon } from '@/app/components/dashboard/PulseIcons'

export default function KnowledgeBasePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Organization state
  const [orgData, setOrgData] = useState({
    name: '',
    industry: 'general',
    website_url: '',
    location: '',
  })

  // Knowledge state
  const [knowledgeData, setKnowledgeData] = useState({
    booking_url: '',
    booking_provider: 'calendly',
    faqs: '',
    target_audience: '',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: membership } = await (supabase.from('organization_members') as any)
          .select('organization_id')
          .eq('user_id', user.id)
          .single()

        if (!membership) return
        const orgId = membership.organization_id

        const { data: org } = await (supabase.from('organizations') as any)
          .select('name, industry, website_url, location')
          .eq('id', orgId)
          .single()

        if (org) {
          setOrgData({
            name: org.name || '',
            industry: org.industry || 'general',
            website_url: org.website_url || '',
            location: org.location || '',
          })
        }

        const { data: knowledge } = await (supabase.from('organization_knowledge') as any)
          .select('booking_url, booking_provider, faqs, target_audience')
          .eq('organization_id', orgId)
          .maybeSingle()

        if (knowledge) {
          setKnowledgeData({
            booking_url: knowledge.booking_url || '',
            booking_provider: knowledge.booking_provider || 'calendly',
            faqs: knowledge.faqs || '',
            target_audience: knowledge.target_audience || '',
          })
        }
      } catch (err) {
        console.error('Error fetching knowledge:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      const { data: membership } = await (supabase.from('organization_members') as any)
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

      if (!membership) throw new Error('Organization not found')
      const orgId = membership.organization_id

      await (supabase.from('organizations') as any)
        .update({
          name: orgData.name,
          industry: orgData.industry,
          website_url: orgData.website_url,
          location: orgData.location,
        })
        .eq('id', orgId)

      await (supabase.from('organization_knowledge') as any)
        .upsert({
          organization_id: orgId,
          booking_url: knowledgeData.booking_url,
          booking_provider: knowledgeData.booking_provider,
          faqs: knowledgeData.faqs,
          target_audience: knowledgeData.target_audience,
          updated_at: new Date().toISOString()
        }, { onConflict: 'organization_id' })

      setMessage({ type: 'success', text: 'Business knowledge base updated successfully!' })
      
      void fetch('/api/agents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, data: { ...orgData, ...knowledgeData } }),
      })

    } catch (err: any) {
      console.error(err)
      setMessage({ type: 'error', text: err.message || 'Failed to save knowledge base.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F7EFF]" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Knowledge Base</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="pulse-btn pulse-btn-primary"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
            Save knowledge
          </button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-6 overflow-y-auto pb-24">
        {/* HERO */}
        <div className="pulse-card p-6 flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(79,126,255,0.1)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F7EFF] to-[#7B5FFF] flex items-center justify-center shrink-0 shadow-lg shadow-[#4f7eff1a]">
            <Database className="text-white w-7 h-7" />
          </div>

          <div className="flex-1">
            <div className="font-['Fraunces'] text-[22px] font-normal text-[#E8EBF2] tracking-[-0.02em]">
              Business <em>knowledge</em>
            </div>
            <div className="text-[12px] text-[#555D72] mt-1">Training facts, pricing, and scheduling rules for your AI agents.</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Business Identity */}
            <div className="pulse-card">
              <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
                <Globe className="text-[#4F7EFF] w-4 h-4" />
                <h3 className="text-[14px] font-medium text-[#E8EBF2]">Business Identity</h3>
              </div>
              <div className="p-5 grid gap-4 grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Organization Name</label>
                  <input 
                    className="pulse-input" 
                    value={orgData.name}
                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Industry</label>
                  <select 
                    className="pulse-input appearance-none"
                    value={orgData.industry}
                    onChange={(e) => setOrgData({ ...orgData, industry: e.target.value })}
                  >
                    <option value="real_estate">Real Estate</option>
                    <option value="medspa">Medspa</option>
                    <option value="doctor">Medical Doctor</option>
                    <option value="salon">Salon</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Website URL</label>
                  <input 
                    className="pulse-input" 
                    value={orgData.website_url}
                    onChange={(e) => setOrgData({ ...orgData, website_url: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Primary Location</label>
                  <input 
                    className="pulse-input" 
                    value={orgData.location}
                    onChange={(e) => setOrgData({ ...orgData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="pulse-card">
              <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
                <MessageSquare className="text-[#22D3A8] w-4 h-4" />
                <h3 className="text-[14px] font-medium text-[#E8EBF2]">Business Intelligence (FAQs)</h3>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <p className="text-[11px] text-[#555D72] leading-relaxed">
                  List service pricing, business hours, and specific policies. The more detail you provide, the smarter your agents become.
                </p>
                <textarea 
                  className="pulse-input min-h-[300px] font-mono !leading-relaxed"
                  value={knowledgeData.faqs}
                  onChange={(e) => setKnowledgeData({ ...knowledgeData, faqs: e.target.value })}
                  placeholder="Example:\n- Our office is open Mon-Fri 9am-6pm.\n- We offer free teeth whitening for new patients."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Booking Integration */}
            <div className="pulse-card">
              <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
                <Calendar className="text-[#A78BFA] w-4 h-4" />
                <h3 className="text-[14px] font-medium text-[#E8EBF2]">Booking Integration</h3>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Provider</label>
                  <select 
                    className="pulse-input appearance-none"
                    value={knowledgeData.booking_provider}
                    onChange={(e) => setKnowledgeData({ ...knowledgeData, booking_provider: e.target.value })}
                  >
                    <option value="calendly">Calendly</option>
                    <option value="google_calendar">Google Calendar</option>
                    <option value="zoho">Zoho Bookings</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Booking URL</label>
                  <input 
                    className="pulse-input" 
                    value={knowledgeData.booking_url}
                    onChange={(e) => setKnowledgeData({ ...knowledgeData, booking_url: e.target.value })}
                    placeholder="Paste link here"
                  />
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="pulse-card">
              <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
                <Users className="text-[#FF6B6B] w-4 h-4" />
                <h3 className="text-[14px] font-medium text-[#E8EBF2]">Target Audience</h3>
              </div>
              <div className="p-5 flex flex-col gap-1.5">
                <textarea 
                  className="pulse-input min-h-[100px]"
                  value={knowledgeData.target_audience}
                  onChange={(e) => setKnowledgeData({ ...knowledgeData, target_audience: e.target.value })}
                  placeholder="e.g. First-time homeowners seeking affordable condos."
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl flex items-start gap-3 border animate-in slide-in-from-top-2 duration-300 ${
                message.type === 'success' ? 'bg-[#22d3a810] border-[#22d3a840] text-[#22D3A8]' : 'bg-[#ff6b6b10] border-[#ff6b6b40] text-[#FF6B6B]'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <p className="text-[12px] font-medium leading-relaxed">{message.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
