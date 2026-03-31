'use client'

import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Starter',
    price: '0',
    period: 'forever free',
    description: 'Perfect for testing and small teams getting started.',
    popular: false,
    accentColor: '#60a5fa',
    accentGlow: 'rgba(96,165,250,0.10)',
    borderHover: 'rgba(96,165,250,0.18)',
    features: [
      '100 leads per month',
      'SMS & Email follow-up',
      'Basic AI voice agent',
      'Basic CRM pipeline',
      'Community support',
    ],
    cta: 'Get Started Free',
    note: 'No credit card required',
    ctaPath: '/signup',
  },
  {
    name: 'Growth',
    price: '97',
    period: 'per month',
    description: 'The go-to plan for businesses ready to scale.',
    popular: true,
    accentColor: '#818cf8',
    accentGlow: 'rgba(129,140,248,0.14)',
    borderHover: 'rgba(129,140,248,0.35)',
    features: [
      '1,000 leads per month',
      'Full multi-channel — SMS, Voice, Email',
      'Advanced AI qualification & objection handling',
      'Calendar sync — Calendly, Google, Outlook',
      'Real-time analytics dashboard',
      'Priority email support',
    ],
    cta: 'Start 14-Day Free Trial',
    note: null,
    ctaPath: '/signup',
  },
  {
    name: 'Scale',
    price: '297',
    period: 'per month',
    description: 'Built for high-volume sales teams that need everything.',
    popular: false,
    accentColor: '#34d399',
    accentGlow: 'rgba(52,211,153,0.10)',
    borderHover: 'rgba(52,211,153,0.18)',
    features: [
      '5,000 leads per month',
      'Unlimited multi-channel usage',
      'Custom AI voice & script training',
      'Advanced analytics & forecasting',
      'API access & integrations',
      'Dedicated account manager',
      'Priority phone & Slack support',
    ],
    cta: 'Contact Sales',
    note: null,
    ctaPath: '/contact',
  },
]

// Minimal check icon in SVG
const Check = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '2px' }}>
    <circle cx="7" cy="7" r="6.5" stroke={color} strokeOpacity="0.25"/>
    <path d="M4 7 L6.2 9.2 L10 5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function PricingSection() {
  const router = useRouter()

  return (
    <section id="pricing" className="relative py-24 lg:py-36 overflow-hidden bg-[#050810]">

      {/* ── Ambient layers ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(129,140,248,0.07),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_50%_at_0%_70%,rgba(96,165,250,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_50%_at_100%_60%,rgba(52,211,153,0.04),transparent)]" />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.032]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Hairlines */}
      <div className="absolute top-0    left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="h-px flex-1 max-w-[80px] sm:max-w-[110px] bg-gradient-to-r from-transparent to-white/12" />
            <span style={{
              fontSize: 'clamp(0.58rem, 0.9vw, 0.68rem)',
              color: 'rgba(255,255,255,0.32)',
              fontFamily: "'Sora', sans-serif",
              letterSpacing: '0.22em',
              fontWeight: 500,
            }}>
              TRANSPARENT PRICING
            </span>
            <div className="h-px flex-1 max-w-[80px] sm:max-w-[110px] bg-gradient-to-l from-transparent to-white/12" />
          </div>

          <h2
            className="font-semibold text-white mb-4 sm:mb-5"
            style={{
              fontSize: 'clamp(2.1rem, 4.8vw, 3.75rem)',
              fontFamily: "'Sora', sans-serif",
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
            }}>
            Simple pricing.{' '}
            <span style={{
              background: 'linear-gradient(135deg,#60a5fa 0%,#818cf8 55%,#a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Powerful results.
            </span>
          </h2>

          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-white/10" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <p style={{
            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: "'Sora', sans-serif",
            lineHeight: 1.7,
          }}>
            Pay only for what you use. Start free today. Scale when you're ready.{' '}
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>No hidden fees, ever.</span>
          </p>
        </div>

        {/* ── Pricing cards ── */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="group relative rounded-2xl sm:rounded-[1.4rem] overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
              style={{
                background: plan.popular
                  ? 'linear-gradient(145deg,rgba(129,140,248,0.10) 0%,rgba(255,255,255,0.022) 100%)'
                  : 'linear-gradient(145deg,rgba(255,255,255,0.052) 0%,rgba(255,255,255,0.014) 100%)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: plan.popular
                  ? '1px solid rgba(129,140,248,0.3)'
                  : '1px solid rgba(255,255,255,0.075)',
                boxShadow: plan.popular
                  ? '0 0 0 1px rgba(129,140,248,0.08) inset,0 24px 60px rgba(129,140,248,0.10),0 20px 50px rgba(0,0,0,0.4)'
                  : '0 0 0 1px rgba(255,255,255,0.03) inset,0 20px 50px rgba(0,0,0,0.35)',
                paddingTop: plan.popular ? '0' : undefined,
              }}>

              {/* Popular top bar */}
              {plan.popular && (
                <div
                  className="w-full py-2.5 text-center"
                  style={{
                    background: 'linear-gradient(90deg,rgba(96,165,250,0.15),rgba(129,140,248,0.2),rgba(167,139,250,0.15))',
                    borderBottom: '1px solid rgba(129,140,248,0.2)',
                  }}>
                  <span style={{
                    fontSize: 'clamp(0.56rem, 0.8vw, 0.64rem)',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: "'Sora', sans-serif",
                    letterSpacing: '0.2em',
                    fontWeight: 500,
                  }}>
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="p-7 sm:p-8 lg:p-9">

                {/* Plan name + description */}
                <div className="mb-7 sm:mb-8">
                  <h3
                    className="font-semibold text-white mb-1.5"
                    style={{
                      fontSize: 'clamp(1.1rem, 1.6vw, 1.3rem)',
                      fontFamily: "'Sora', sans-serif",
                      letterSpacing: '-0.02em',
                    }}>
                    {plan.name}
                  </h3>
                  <p style={{
                    fontSize: 'clamp(0.75rem, 1vw, 0.84rem)',
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: "'Sora', sans-serif",
                    lineHeight: 1.55,
                  }}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-2 mb-7 sm:mb-8">
                  <div style={{
                    fontSize: 'clamp(2.6rem, 5vw, 3.6rem)',
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '-0.04em',
                    color: plan.popular ? plan.accentColor : 'white',
                    lineHeight: 1,
                    textShadow: plan.popular ? `0 0 32px ${plan.accentGlow.replace('0.14','0.5')}` : 'none',
                  }}>
                    <span style={{ fontSize: '55%', verticalAlign: 'super', marginRight: '1px', opacity: 0.7 }}>$</span>
                    {plan.price}
                  </div>
                  <span style={{
                    fontSize: 'clamp(0.72rem, 1vw, 0.82rem)',
                    color: 'rgba(255,255,255,0.28)',
                    fontFamily: "'Sora', sans-serif",
                    paddingBottom: '6px',
                    lineHeight: 1.3,
                  }}>
                    /{plan.period}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px w-full mb-7"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)' }} />

                {/* Features */}
                <ul className="space-y-3.5 mb-8 sm:mb-9">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check color={plan.accentColor} />
                      <span style={{
                        fontSize: 'clamp(0.78rem, 1.05vw, 0.86rem)',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: "'Sora', sans-serif",
                        lineHeight: 1.55,
                      }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => router.push(plan.ctaPath)}
                  className="group/btn relative w-full rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    padding: 'clamp(0.75rem, 1.1vw, 0.9rem) 1rem',
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    fontSize: 'clamp(0.8rem, 1.1vw, 0.88rem)',
                    letterSpacing: '0.01em',
                    ...(plan.popular
                      ? {
                          background: 'linear-gradient(135deg,rgba(255,255,255,0.93),rgba(220,230,255,0.88))',
                          color: '#0a0e1a',
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.18) inset,0 8px 28px rgba(129,140,248,0.25),0 2px 8px rgba(0,0,0,0.35)',
                        }
                      : {
                          background: 'linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))',
                          color: 'rgba(255,255,255,0.75)',
                          border: `1px solid ${plan.borderHover}`,
                        }),
                  }}>
                  {/* Shimmer on popular */}
                  {plan.popular && (
                    <span
                      className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)' }}
                    />
                  )}
                  <span className="relative">{plan.cta}</span>
                </button>

                {plan.note && (
                  <p className="text-center mt-3" style={{
                    fontSize: 'clamp(0.65rem, 0.85vw, 0.72rem)',
                    color: 'rgba(255,255,255,0.22)',
                    fontFamily: "'Sora', sans-serif",
                  }}>
                    {plan.note}
                  </p>
                )}
              </div>

              {/* Hover glow for non-popular */}
              {!plan.popular && (
                <div
                  className="absolute inset-0 rounded-2xl sm:rounded-[1.4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 30% 20%,${plan.accentGlow},transparent 65%)`,
                    border: `1px solid ${plan.borderHover}`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-12 sm:mt-14 flex items-center justify-center gap-3">
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-white/8" />
          <p style={{
            fontSize: 'clamp(0.68rem, 0.95vw, 0.76rem)',
            color: 'rgba(255,255,255,0.22)',
            fontFamily: "'Sora', sans-serif",
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}>
            All plans include core AI features · Cancel anytime · Usage-based overage protection
          </p>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-white/8" />
        </div>
      </div>
    </section>
  )
}