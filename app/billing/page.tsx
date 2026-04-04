'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2, CreditCard, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Plan, Subscription } from '@/lib/supabase/types'

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

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

      // 1. Fetch org membership + country
      const { data: membership } = await (supabase.from('organization_members') as any)
        .select('organization_id, organizations(country)')
        .eq('user_id', user.id)
        .single()

      // 2. Determine region from org country
      const orgCountry: string = membership?.organizations?.country?.toLowerCase() || 'us'
      const detectedRegion: 'india' | 'us' = orgCountry === 'india' || orgCountry === 'in' ? 'india' : 'us'
      setRegion(detectedRegion)

      // 3. Fetch Plans for that region only
      const { data: plansData } = await supabase
        .from('plans')
        .select('*')
        .eq('region', detectedRegion)
        .order('price_monthly', { ascending: true })
      if (plansData) setPlans(plansData)

      // 4. Fetch Active Subscription
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
        // Load Razorpay Script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => {
          const options = {
            key: data.keyId,
            subscription_id: data.subscriptionId,
            name: data.name,
            description: data.description,
            handler: function (response: any) {
              // Webhook will handle the main sync, but we can redirect or refresh
              window.location.href = '/billing?success=true'
            },
            prefill: data.prefill,
            theme: { color: '#4F46E5' }
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <CreditCard className="text-white" size={24} />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-400">
                Billing & Subscription
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Scale your AI workforce with simple, transparent pricing
              </p>
            </div>
          </div>
          
          {subscription && (
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl dark:bg-emerald-500/10 dark:border-emerald-500/20">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Active Subscription</span>
            </div>
          )}
        </div>
      </header>

      {/* Pricing Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = subscription?.plan_id === plan.id
          const features = typeof plan.keyFeatures === 'string' ? JSON.parse(plan.keyFeatures) : (plan.keyFeatures as string[])

          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-[32px] border p-8 transition-all duration-300 hover:scale-[1.02] ${
                isCurrent
                  ? 'border-indigo-600 bg-[#0f172a] text-white shadow-2xl shadow-indigo-500/20 dark:border-indigo-400 dark:bg-white dark:text-gray-900'
                  : 'border-gray-100 bg-white shadow-sm hover:shadow-xl dark:border-gray-800 dark:bg-[#0d1220]'
              }`}
            >
              {plan.name === 'Pro' && !isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-extrabold tracking-tight">
                  {plan.name}
                </h2>
                {isCurrent && (
                  <div className="p-1 px-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 dark:bg-indigo-600/10 dark:text-indigo-600">
                    <Sparkles size={14} />
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{plan.currency === 'usd' ? '$' : '₹'}{plan.price_monthly}</span>
                <span className={`text-sm font-medium ${isCurrent ? 'opacity-60' : 'text-gray-500'}`}>/mo</span>
              </div>

              <ul className={`mt-8 flex-1 space-y-4 text-sm font-medium ${isCurrent ? 'text-white/70 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
                {features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className={`p-0.5 rounded-full ${isCurrent ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600 dark:bg-[#11192d] dark:text-indigo-400'}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <button
                  onClick={() => handleCheckout(plan)}
                  disabled={isCurrent || !!processingId}
                  className={`
                    group w-full rounded-2xl py-4 text-sm font-black transition-all flex items-center justify-center gap-2
                    ${isCurrent 
                      ? 'bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20' 
                      : isCurrent 
                        ? 'bg-white text-gray-900 border-2 border-gray-100'
                        : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-95'
                    }
                  `}
                >
                  {processingId === plan.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isCurrent ? (
                    'Active Plan'
                  ) : (
                    <>
                      Upgrade to {plan.name}
                    </>
                  )}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {/* Security Info */}
      <footer className="flex flex-col md:flex-row items-center justify-center gap-8 py-6 text-gray-400 dark:text-gray-600">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-center">Secure 256-bit SSL encrypted payments</span>
        </div>
      </footer>
    </section>
  )
}

function ShieldCheck({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
