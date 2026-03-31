'use client'

import { motion } from 'framer-motion'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  textReveal,
} from '@/lib/framer-utils'
import { Tilt3D } from '@/lib/Tilt3D'
import { MagneticButton } from '@/lib/MagneticButton'

const steps = [
  {
    number: '01',
    title: 'Connect & Generate',
    description:
      'Paste your website URL. Our AI instantly analyses your business and generates hyper-personalized voice scripts, SMS sequences, and email campaigns tailored to your audience.',
    accentColor: '#60a5fa',
    accentGlow: 'rgba(96,165,250,0.13)',
    borderHover: 'rgba(96,165,250,0.22)',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path d="M6 18 C6 11 11 6 18 6" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M30 18 C30 25 25 30 18 30" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="18" cy="6"  r="2.5" fill="#60a5fa" fillOpacity="0.7"/>
        <circle cx="18" cy="30" r="2.5" fill="#60a5fa" fillOpacity="0.7"/>
        <circle cx="18" cy="18" r="3.5" stroke="#60a5fa" strokeWidth="1.4"/>
        <line x1="21" y1="15" x2="29" y2="9"  stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="30" cy="8" r="2" fill="#60a5fa"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Multi-Channel Launch',
    description:
      'AI agents engage every lead 24/7 across SMS, intelligent voice calls, and email — qualifying prospects, handling objections, and keeping the conversation alive.',
    accentColor: '#34d399',
    accentGlow: 'rgba(52,211,153,0.12)',
    borderHover: 'rgba(52,211,15,0.22)',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <circle cx="18" cy="18" r="3" fill="#34d399" fillOpacity="0.55"/>
        <circle cx="5"  cy="18" r="2.5" stroke="#34d399" strokeWidth="1.4"/>
        <circle cx="31" cy="18" r="2.5" stroke="#34d399" strokeWidth="1.4"/>
        <circle cx="18" cy="5"  r="2.5" stroke="#34d399" strokeWidth="1.4"/>
        <circle cx="18" cy="31" r="2.5" stroke="#34d399" strokeWidth="1.4"/>
        <circle cx="9"  cy="9"  r="2"   stroke="#34d399" strokeWidth="1.2"/>
        <circle cx="27" cy="27" r="2"   stroke="#34d399" strokeWidth="1.2"/>
        <line x1="8"  y1="18" x2="15" y2="18" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="21" y1="18" x2="28" y2="18" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="18" y1="8"  x2="18" y2="15" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="18" y1="21" x2="18" y2="28" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="11" y1="11" x2="15" y2="15" stroke="#34d399" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6"/>
        <line x1="25" y1="25" x2="21" y2="21" stroke="#34d399" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Instant Booking & Sync',
    description:
      'Hot leads are automatically booked into your calendar. Everything syncs in real-time with your CRM, Calendly, Google Calendar, or Outlook — zero manual work.',
    accentColor: '#a78bfa',
    accentGlow: 'rgba(167,139,250,0.12)',
    borderHover: 'rgba(167,139,250,0.22)',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <rect x="5" y="9" width="26" height="22" rx="3" stroke="#a78bfa" strokeWidth="1.5"/>
        <line x1="5" y1="15" x2="31" y2="15" stroke="#a78bfa" strokeWidth="1.2"/>
        <line x1="12" y1="5" x2="12" y2="12" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="5" x2="24" y2="12" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 23 L15.5 27.5 L25 19" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Continuous Optimisation',
    description:
      "Powerful analytics reveal exactly what's working. The AI learns from every conversation and continuously refines scripts to maximise your booking rate over time.",
    accentColor: '#fbbf24',
    accentGlow: 'rgba(251,191,36,0.10)',
    borderHover: 'rgba(251,191,36,0.22)',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <rect x="4"  y="22" width="6" height="10" rx="1.5" stroke="#fbbf24" strokeWidth="1.4"/>
        <rect x="15" y="15" width="6" height="17" rx="1.5" stroke="#fbbf24" strokeWidth="1.4"/>
        <rect x="26" y="7"  width="6" height="25" rx="1.5" stroke="#fbbf24" strokeWidth="1.4"/>
        <path d="M7 20 L18 13 L29 6" stroke="#fbbf24" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 2.5"/>
        <circle cx="29" cy="6" r="2.2" fill="#fbbf24"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="relative py-24 lg:py-36 overflow-hidden bg-[#050810]"
    >
      {/* Ambient layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(96,165,250,0.07),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_45%_at_0%_60%,rgba(52,211,153,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_45%_at_100%_70%,rgba(167,139,250,0.04),transparent)]" />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.032]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Top / bottom hairlines */}
      <div className="absolute top-0    left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 lg:mb-24"
        >
          {/* Eyebrow */}
          <motion.div variants={staggerItem} className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="h-px flex-1 max-w-[80px] sm:max-w-[110px] bg-gradient-to-r from-transparent to-white/12" />
            <span
              className="tracking-[0.22em] font-medium"
              style={{
                fontSize: 'clamp(0.58rem, 0.9vw, 0.68rem)',
                color: 'rgba(255,255,255,0.32)',
                fontFamily: "var(--font-sora), sans-serif",
                letterSpacing: '0.22em',
                fontWeight: 500,
              }}>
              SIMPLE · POWERFUL · AUTOMATIC
            </span>
            <div className="h-px flex-1 max-w-[80px] sm:max-w-[110px] bg-gradient-to-l from-transparent to-white/12" />
          </motion.div>

          <motion.h2
            variants={textReveal}
            className="font-semibold text-white mb-4 sm:mb-5"
            style={{
              fontSize: 'clamp(2.1rem, 4.8vw, 3.75rem)',
              fontFamily: "var(--font-sora), sans-serif",
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
            }}
          >
            How CloseFlow{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#60a5fa 0%,#818cf8 55%,#a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              Works
            </span>
          </motion.h2>

          {/* Ornamental rule */}
          <motion.div variants={staggerItem} className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-white/10" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>

          <motion.p
            variants={staggerItem}
            style={{
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: "var(--font-sora), sans-serif",
              lineHeight: 1.7,
            }}
          >
            From website URL to booked meetings in minutes —{' '}
            <span style={{ color: 'rgba(255,255,255,0.68)' }}>
              completely on autopilot.
            </span>
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 relative"
        >
          {/* Connector line - desktop only */}
          <div
            className="hidden lg:block absolute top-[52px] left-[calc(25%+1px)] right-[calc(25%+1px)] h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg,rgba(96,165,250,0.25),rgba(167,139,250,0.25),rgba(96,165,250,0.25))',
            }}
          />

          {steps.map((s, i) => (
            <Tilt3D key={s.number} maxTilt={8} scale={1.02} speed={500}>
              <motion.div
                variants={staggerItem}
                className="group relative rounded-2xl sm:rounded-[1.4rem] p-6 sm:p-7 overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
                style={{
                  background:
                    'linear-gradient(145deg,rgba(255,255,255,0.052) 0%,rgba(255,255,255,0.014) 100%)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255,255,255,0.075)',
                  boxShadow:
                    '0 0 0 1px rgba(255,255,255,0.03) inset,0 20px 50px rgba(0,0,0,0.35)',
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl sm:rounded-[1.4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 30% 20%,${s.accentGlow},transparent 65%)`,
                    border: `1px solid ${s.borderHover}`,
                  }}
                />

                {/* Icon + step number row */}
                <div className="flex items-center justify-between mb-6 sm:mb-7 relative z-10">
                  {/* Glass icon pill */}
                  <div
                    className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background:
                        'linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))',
                      border: `1px solid ${s.borderHover.replace('0.22','0.15')}`,
                      boxShadow: `0 4px 16px ${s.accentGlow}`,
                    }}
                  >
                    {s.icon}
                  </div>

                  {/* Step number */}
                  <span
                    style={{
                      fontSize: 'clamp(0.6rem, 0.85vw, 0.7rem)',
                      color: 'rgba(255,255,255,0.18)',
                      fontFamily: "var(--font-sora), monospace",
                      letterSpacing: '0.1em',
                      fontWeight: 500,
                    }}
                  >
                    {s.number}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-white font-semibold mb-3 relative z-10"
                  style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                    fontFamily: "var(--font-sora), sans-serif",
                    letterSpacing: '-0.018em',
                    lineHeight: 1.25,
                  }}
                >
                  {s.title}
                </h3>

                {/* Description */}
                <p
                  className="relative z-10"
                  style={{
                    fontSize: 'clamp(0.8rem, 1.05vw, 0.88rem)',
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: "var(--font-sora), sans-serif",
                    lineHeight: 1.72,
                  }}
                >
                  {s.description}
                </p>

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg,transparent,${s.accentColor}55,transparent)`,
                  }}
                />

                {/* Arrow connector for non-last desktop */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:flex absolute -right-3 top-[52px] -translate-y-1/2 z-20 items-center justify-center w-6 h-6 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4h6M5 2l2 2-2 2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            </Tilt3D>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p
            className="mb-5"
            style={{
              fontSize: 'clamp(0.78rem, 1.1vw, 0.88rem)',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "var(--font-sora), sans-serif",
              letterSpacing: '0.04em',
            }}
          >
            Ready to see it in action?
          </p>

          <MagneticButton
            onClick={() => window.location.href = '#demo'}
            className="group relative inline-flex items-center gap-3 font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            style={{
              padding: 'clamp(0.85rem, 1.2vw, 1rem) clamp(1.6rem, 2.5vw, 2.2rem)',
              fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
              fontFamily: "var(--font-sora), sans-serif",
              background: 'linear-gradient(135deg,rgba(255,255,255,0.92),rgba(220,230,255,0.88))',
              color: '#0a0e1a',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.18) inset,0 8px 28px rgba(96,165,250,0.22),0 2px 8px rgba(0,0,0,0.35)',
            }}
          >
            {/* Shimmer */}
            <span
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              style={{
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)',
              }}
            />
            <span className="relative">Watch how it works in 2 minutes</span>
            <span className="relative text-base group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </MagneticButton>
        </motion.div>
      </div>
    </motion.section>
  )
}