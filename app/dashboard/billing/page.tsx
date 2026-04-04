'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2, CreditCard, Sparkles, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Plan, Subscription } from '@/lib/supabase/types'
import { BillingIcon, ChevronDownIcon, PlusIcon } from '@/app/components/dashboard/PulseIcons'

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [region, setRegion] = useState<'india' | 'us'>('us')

  useEffect(() => {
    fetchBillingData()
  }, [])

  async function fetchBillingData() {
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

      const { data: plansData } = await supabase
        .from('plans')
        .select('*')
        .eq('region', detectedRegion)
        .order('price_monthly', { ascending: true })
      if (plansData) setPlans(plansData as Plan[])

      if (membership) {
        const { data: subData } = await (supabase.from('subscriptions') as any)
          .select('*')
          .eq('organization_id', membership.organization_id)
          .eq('status', 'active')
          .single()

        if (subData) setSubscription(subData)
      }
    } catch (err) {
      console.error('Error fetching billing data:', err)
    } finally {
      setLoading(false)
    }
  }

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
            handler: function () {
              window.location.href = '/dashboard/billing?success=true'
            },
            prefill: data.prefill,
            theme: { color: '#4F7EFF' }
          }
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
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
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Billing & Subscription</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="pulse-btn pulse-btn-ghost">Billing history</button>
          <button className="pulse-btn pulse-btn-primary">Manage payment</button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-6 overflow-y-auto">
        {/* HERO */}
        <div className="pulse-card p-6 flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(79,126,255,0.1)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F7EFF] to-[#A78BFA] flex items-center justify-center shrink-0 shadow-lg shadow-[#4f7eff1a]">
            <BillingIcon className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1">
            <div className="font-['Fraunces'] text-[22px] font-normal text-[#E8EBF2] tracking-[-0.02em]">
              Subscription <em>plans</em>
            </div>
            <div className="text-[12px] text-[#555D72] mt-1">Scale your AI workforce with simple, transparent pricing.</div>
          </div>

          {subscription && (
            <div className="flex items-center gap-3 px-4 py-2 border border-[#22d3a840] bg-[#22d3a810] rounded-xl">
              <div className="h-2 w-2 rounded-full bg-[#22D3A8] animate-pulse" />
              <span className="text-[11px] font-bold text-[#22D3A8] uppercase tracking-wider">Active Subscription</span>
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        {plans.length === 0 ? (
          <div className="pulse-card p-16 text-center border-dashed border-[#ffffff1f]">
            <p className="text-[#555D72] text-[13px]">No plans available for your region ({region}). Please contact support.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = subscription?.plan_id === plan.id
              const features = typeof plan.keyFeatures === 'string'
                ? JSON.parse(plan.keyFeatures as unknown as string)
                : (plan.keyFeatures as string[])

              const isPro = plan.name === 'Pro'

              return (
                <article
                  key={plan.id}
                  className={`pulse-card p-8 flex flex-col transition-all duration-300 relative group ${
                    isCurrent ? 'border-[#4F7EFF40] bg-[#4f7eff05]' : 'hover:border-[#ffffff1f]'
                  }`}
                >
                  {isPro && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F7EFF] text-white text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[18px] font-bold text-[#E8EBF2]">{plan.name}</h2>
                    {isCurrent && (
                      <div className="p-1.5 rounded-lg bg-[#4f7eff1a] text-[#4F7EFF]">
                        <Sparkles size={14} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-bold text-[#E8EBF2] tracking-[-0.02em]">
                      {plan.currency === 'usd' ? '$' : '₹'}{plan.price_monthly.toLocaleString()}
                    </span>
                    <span className="text-[13px] text-[#555D72]">/month</span>
                  </div>

                  <ul className="mt-8 flex-1 space-y-4">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-[#4f7eff1a] text-[#4F7EFF] flex items-center justify-center shrink-0">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="text-[13px] text-[#8B92A8]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(plan)}
                    disabled={isCurrent || !!processingId}
                    className={`pulse-btn w-full justify-center !py-3.5 mt-10 ${
                      isCurrent 
                      ? 'pulse-btn-ghost !text-[#22D3A8] !border-[#22d3a840] !bg-[#22d3a808] cursor-default' 
                      : 'pulse-btn-primary'
                    }`}
                  >
                    {processingId === plan.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : isCurrent ? (
                      'Active Plan'
                    ) : (
                      <>Select {plan.name}</>
                    )}
                  </button>
                </article>
              )
            })}
          </div>
        )}

        {/* Security Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-10 opacity-50">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#555D72]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#555D72]">Secure 256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#555D72]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#555D72]">
              Powered by {region === 'india' ? 'Razorpay' : 'Stripe'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
