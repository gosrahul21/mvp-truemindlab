'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, Loader2, Sparkles, Zap, Smartphone, Phone, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Plan, Subscription } from '@/lib/supabase/types'
import { BillingIcon, PlusIcon } from '@/app/components/dashboard/PulseIcons'

type UsageStats = {
  leadsUsed: number
  leadsLimit: number
  leadsPct: number
  voiceMinsUsed: number
  voiceMinsLimit: number
  voiceMinsPct: number
  whatsappUsed: number
  whatsappLimit: number
  whatsappPct: number
  dailyGrowth: { day: string; count: number }[]
}

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [region, setRegion] = useState<'india' | 'us'>('us')
  const [usage, setUsage] = useState<UsageStats>({
    leadsUsed: 0, leadsLimit: 1000, leadsPct: 0,
    voiceMinsUsed: 0, voiceMinsLimit: 200, voiceMinsPct: 0,
    whatsappUsed: 0, whatsappLimit: 0, whatsappPct: 0,
    dailyGrowth: []
  })

  const fetchLeadsUsage = useCallback(async (orgId: string, startDate: string, limit: number) => {
    // 1. Leads added in current period
    const { count } = await (supabase.from('leads') as any)
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', orgId)
      .gte('created_at', startDate)
    
    // 2. Daily growth (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    const { data: recentLeads } = await (supabase.from('leads') as any)
      .select('created_at')
      .eq('organization_id', orgId)
      .gte('created_at', sevenDaysAgo.toISOString())
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const growth = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayLabel = days[d.getDay()]
      const count = recentLeads?.filter((l: any) => new Date(l.created_at).toDateString() === d.toDateString()).length || 0
      return { day: dayLabel, count }
    }).reverse()

    return { used: count || 0, pct: Math.min(((count || 0) / limit) * 100, 100), daily: growth }
  }, [])

  const fetchBillingData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: membership } = await (supabase.from('organization_members') as any)
        .select('organization_id, organizations(country)')
        .eq('user_id', user.id)
        .single()

      const orgCountry: string = membership?.organizations?.country?.toLowerCase() || 'us'
      const detectedRegion: 'india' | 'us' = orgCountry === 'india' || orgCountry === 'in' ? 'india' : 'us'
      setRegion(detectedRegion)

      // Fetch Plans
      const { data: plansData } = await supabase
        .from('plans')
        .select('*')
        .eq('region', detectedRegion)
        .order('price_monthly', { ascending: true })
      if (plansData) setPlans(plansData as Plan[])

      // Fetch Sub + Usage
      if (membership) {
        const { data: subData } = await (supabase.from('subscriptions') as any)
          .select('*, plans(*)')
          .eq('organization_id', membership.organization_id)
          .eq('status', 'active')
          .single()

        if (subData) {
          setSubscription(subData)
          const plan = subData.plans
          const leadsUsage = await fetchLeadsUsage(
            membership.organization_id, 
            subData.current_period_start, 
            plan.contacts_limit || 1000
          )
          
          setUsage({
            leadsUsed: leadsUsage.used,
            leadsLimit: plan.contacts_limit,
            leadsPct: leadsUsage.pct,
            voiceMinsUsed: 0, // Injected voice minutes logic goes here if table exists
            voiceMinsLimit: plan.voice_min_limit,
            voiceMinsPct: 0,
            whatsappUsed: 0,
            whatsappLimit: plan.whatsapp_limit,
            whatsappPct: 0,
            dailyGrowth: leadsUsage.daily
          })
        }
      }
    } catch (err) {
      console.error('Error fetching billing data:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchLeadsUsage])

  useEffect(() => {
    fetchBillingData()
  }, [fetchBillingData])

  const handleCheckout = async (plan: Plan) => {
    setProcessingId(plan.id)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, region: plan.region })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      if (data.gateway === 'stripe') {
        window.location.href = data.url
      } else if (data.gateway === 'razorpay') {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => {
          const options = {
            key: data.keyId,
            subscription_id: data.subscriptionId,
            name: data.name,
            description: data.description,
            handler: () => { window.location.href = '/dashboard/billing?success=true' },
            prefill: data.prefill,
            theme: { color: '#4F7EFF' }
          }
          new (window as any).Razorpay(options).open()
        }
        document.body.appendChild(script)
      }
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F7EFF]" />
        <p className="text-[12px] text-[#555D72] mt-4 uppercase tracking-widest font-bold">Synchronizing billing records...</p>
      </div>
    )
  }

  const nextBillingDate = subscription?.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A'

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Usage & Billing</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22d3a810] border border-[#22d3a820]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22D3A8] animate-pulse" />
            <span className="text-[10px] font-bold text-[#22D3A8] uppercase tracking-wider">Plan: {subscription?.plans?.name || 'Free'}</span>
          </div>
          <button className="pulse-btn pulse-btn-primary ml-2">Billing History</button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-6 overflow-y-auto">
        
        {/* HERO + CURRENT USAGE */}
        <div className="grid lg:grid-cols-4 gap-4">
          
          {/* Active Plan Card */}
          <div className="lg:col-span-1 pulse-card p-6 flex flex-col justify-between relative overflow-hidden group border-[#4F7EFF40] bg-[#4f7eff08]">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-gradient-to-br from-[#4F7EFF] to-transparent opacity-20 blur-2xl" />
            <div>
              <div className="text-[11px] font-bold text-[#4F7EFF] uppercase tracking-widest mb-1">Current Plan</div>
              <div className="text-[24px] font-black text-[#E8EBF2]">{subscription?.plans?.name || 'Starter'}</div>
              <div className="text-[11px] text-[#8B92A8] mt-4 italic">Next billing on {nextBillingDate}</div>
            </div>
            <button className="pulse-btn pulse-btn-ghost mt-6 text-[11px] !py-2">Manage Payment</button>
          </div>

          {/* Usage Stats (Progress Bars) */}
          <div className="lg:col-span-2 pulse-card p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-medium text-[#E8EBF2]">Resource Usage</div>
              <div className="text-[10px] text-[#555D72] uppercase tracking-wider font-bold">Billing cycle: Monthly</div>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Platform Leads', icon: <Users size={12}/>, used: usage.leadsUsed, limit: usage.leadsLimit, pct: usage.leadsPct, color: '#4F7EFF' },
                { label: 'Voice Minutes', icon: <Phone size={12}/>, used: usage.voiceMinsUsed, limit: usage.voiceMinsLimit, pct: usage.voiceMinsPct, color: '#A78BFA' },
                { label: 'WhatsApp MSGs', icon: <Smartphone size={12}/>, used: usage.whatsappUsed, limit: usage.whatsappLimit, pct: usage.whatsappPct, color: '#22D3A8' },
              ].map(stat => (
                <div key={stat.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-[#8B92A8]">
                      {stat.icon}
                      <span className="font-medium">{stat.label}</span>
                    </div>
                    <span className="text-[#E8EBF2] font-mono">{stat.used.toLocaleString()} / {stat.limit.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-[#ffffff08] rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-700 ease-out rounded-full" 
                      style={{ width: `${stat.pct}%`, backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}40` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Insight (SVG Chart) */}
          <div className="lg:col-span-1 pulse-card p-6 flex flex-col">
            <div className="text-[14px] font-medium text-[#E8EBF2] mb-1">Growth Insight</div>
            <div className="text-[11px] text-[#555D72] mb-6">Leads added past 7 days</div>
            <div className="flex-1 flex items-end justify-between gap-1 mt-auto">
              {usage.dailyGrowth.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-[#4F7EFF20] hover:bg-[#4F7EFF] rounded-t-sm transition-all duration-300 relative"
                    style={{ height: `${Math.max((d.count / (Math.max(...usage.dailyGrowth.map(x=>x.count)) || 1)) * 40, 4)}px` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#171C28] border border-[#ffffff10] text-[9px] text-[#E8EBF2] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow-xl">
                      {d.count}
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-[#555D72] uppercase tracking-tighter">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* PRICING GRID */}
        <div className="mt-4">
          <div className="flex flex-col items-center mb-8">
            <h2 className="font-['Fraunces'] text-[24px] text-[#E8EBF2]">Choose your plan</h2>
            <p className="text-[12px] text-[#555D72] mt-1">Upgrade your AI workforce instantly</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = subscription?.plan_id === plan.id
              const features = typeof plan.keyFeatures === 'string' 
                ? JSON.parse(plan.keyFeatures) 
                : plan.keyFeatures
              const isPro = plan.name === 'Pro'

              return (
                <article
                  key={plan.id}
                  className={`pulse-card p-8 flex flex-col transition-all duration-500 relative group animate-in fade-in slide-in-from-bottom-4 ${
                    isCurrent ? 'border-[#4F7EFF] bg-[#4f7eff0a] shadow-[0_0_50px_rgba(79,126,255,0.05)]' : 'hover:border-[#ffffff1f]'
                  }`}
                >
                  {isPro && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4F7EFF] to-[#A78BFA] text-white text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full shadow-xl">
                      Best Value
                    </div>
                  )}

                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-[20px] font-black text-[#E8EBF2] tracking-tighter">{plan.name}</h2>
                      <div className="text-[11px] text-[#555D72] mt-1">{plan.contacts_limit.toLocaleString()} Leads limit</div>
                    </div>
                    {isCurrent && (
                      <div className="w-8 h-8 rounded-xl bg-[#22D3A8] flex items-center justify-center text-[#0A0D12] shadow-[0_0_20px_rgba(34,211,168,0.3)]">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-[42px] font-black text-[#E8EBF2] tracking-tighter">
                      {plan.currency === 'usd' ? '$' : '₹'}{plan.price_monthly.toLocaleString()}
                    </span>
                    <span className="text-[14px] text-[#555D72]">/month</span>
                  </div>

                  <ul className="flex-1 space-y-4 mb-10">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 w-4 h-4 rounded-full bg-[#ffffff0a] text-[#4F7EFF] flex items-center justify-center shrink-0 border border-[#ffffff0f]">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="text-[13px] text-[#8B92A8] font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(plan)}
                    disabled={isCurrent || !!processingId}
                    className={`pulse-btn w-full justify-center !py-4 transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-transparent text-[#22D3A8] border-[#22d3a830] cursor-default' 
                        : 'pulse-btn-primary hover:shadow-[0_0_30px_rgba(79,126,255,0.2)]'
                    }`}
                  >
                    {processingId === plan.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : isCurrent ? (
                      'Selected Plan'
                    ) : (
                      <>Upgrade to {plan.name}</>
                    )}
                  </button>
                </article>
              )
            })}
          </div>
        </div>

        {/* ADD-ONS SECTION (UI ONLY) */}
        <div className="mt-10 border-t border-[#ffffff08] pt-12">
          <div className="flex flex-col items-center mb-8">
            <h2 className="font-['Fraunces'] text-[24px] text-[#E8EBF2]">Plan Add-ons</h2>
            <p className="text-[12px] text-[#555D72] mt-1">Need more? Boost your capacity instantly</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <Zap size={16}/>, label: 'Turbo Minutes', price: '$29', desc: 'Add 500 extra voice minutes', color: '#F5A623' },
              { icon: <Smartphone size={16}/>, label: 'SMS Blast', price: '$19', desc: 'Add 5,000 extra SMS units', color: '#22D3A8' },
              { icon: <Sparkles size={16}/>, label: 'Elite Support', price: '$49', desc: '24/7 dedicated manager', color: '#A78BFA' },
            ].map(addon => (
              <div key={addon.label} className="pulse-card p-5 flex items-center gap-4 hover:border-[#ffffff14] cursor-pointer transition">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-[#ffffff0f] bg-[#ffffff05]" style={{ color: addon.color }}>
                  {addon.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-[#E8EBF2]">{addon.label}</div>
                  <div className="text-[11px] text-[#555D72]">{addon.desc}</div>
                </div>
                <div className="text-[14px] font-black text-[#E8EBF2]">{addon.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER CERTS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-12 opacity-30 mt-6 grayscale">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#555D72]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555D72]">Bank-grade Encryption</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555D72]">Powered by {region === 'india' ? 'Razorpay' : 'Stripe'} Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}
