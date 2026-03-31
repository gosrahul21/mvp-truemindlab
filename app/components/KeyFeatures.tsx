'use client'

import { motion } from 'framer-motion'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  textReveal,
} from '@/lib/framer-utils'
import { Tilt3D } from '@/lib/Tilt3D'

const features = [
  {
    id: 'multichannel',
    highlight: true,
    accentColor: '#34d399',
    accentGlow: 'rgba(52,211,153,0.12)',
    borderHover: 'rgba(52,211,153,0.22)',
    number: '01',
    title: 'Reach every lead instantly',
    description:
      'Engage prospects across SMS, AI voice calls, and email — automatically, 24/7. Never miss a high-intent lead again.',
    proof: '+38% response rate',
  },
  {
    id: 'booking',
    accentColor: '#f472b6',
    accentGlow: 'rgba(244,114,182,0.10)',
    borderHover: 'rgba(244,114,182,0.22)',
    number: '02',
    title: 'Book meetings on autopilot',
    description:
      'Qualified leads are instantly scheduled into your calendar. No back-and-forth. No manual effort.',
    proof: '3.2× more bookings',
  },
  {
    id: 'qualification',
    accentColor: '#a78bfa',
    accentGlow: 'rgba(167,139,250,0.12)',
    borderHover: 'rgba(167,139,250,0.22)',
    number: '03',
    title: 'Talk only to serious buyers',
    description:
      'AI filters, qualifies, and nurtures leads — so your team focuses only on high-intent prospects.',
    proof: '92% qualification accuracy',
  },
  {
    id: 'ai-asset',
    accentColor: '#60a5fa',
    accentGlow: 'rgba(96,165,250,0.12)',
    borderHover: 'rgba(96,165,250,0.22)',
    number: '04',
    title: 'Generate scripts in seconds',
    description:
      'Paste your website URL and instantly get personalized voice, SMS, and email sequences tailored to your brand.',
    proof: 'Setup in < 2 min',
  },
  {
    id: 'crm',
    accentColor: '#fbbf24',
    accentGlow: 'rgba(251,191,36,0.10)',
    borderHover: 'rgba(251,191,36,0.22)',
    number: '05',
    title: 'See your pipeline clearly',
    description:
      'Track every lead, conversation, and deal in one clean dashboard — with zero manual updates.',
    proof: '100% auto-tracked',
  },
  {
    id: 'analytics',
    accentColor: '#38bdf8',
    accentGlow: 'rgba(56,189,248,0.10)',
    borderHover: 'rgba(56,189,248,0.22)',
    number: '06',
    title: 'Know what actually works',
    description:
      'Get deep insights into performance, conversions, and ROI — and scale what brings results.',
    proof: 'Real-time insights',
  },
]

export default function KeyFeatures() {
  return (
    <motion.section
      id="features"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={fadeInUp}
      className="relative py-24 lg:py-36 overflow-hidden bg-[#050810]"
    >
      {/* Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(96,165,250,0.07),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_100%_50%,rgba(167,139,250,0.05),transparent)]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          {/* <motion.h2
            variants={textReveal}
            className="text-white font-semibold mb-5"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              letterSpacing: '-0.03em',
            }}
          >
            Turn every lead into revenue.
          </motion.h2> */}

          <motion.h2
            variants={textReveal}
            className="font-semibold text-white mb-5"
            style={{
              fontSize: 'clamp(2.1rem, 4.8vw, 3.8rem)',
              fontFamily: "var(--font-sora), sans-serif",
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
            }}
          >
            {/* Everything you need. */}
            Turn every lead into
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg,#60a5fa 0%,#818cf8 50%,#a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              {/* Nothing you don't. */}
              Revenue
            </span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-white/50 max-w-xl mx-auto"
          >
            A complete AI system that captures, qualifies, nurtures, and books
            your leads — automatically.
          </motion.p>
        </motion.div>



        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <Tilt3D key={f.id}>
              <motion.div
                variants={staggerItem}
                className={`group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                  f.highlight ? 'lg:col-span-2' : ''
                }`}
                style={{
                  background:
                    'linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))',
                  backdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${f.accentGlow}, transparent 70%)`,
                  }}
                />

                {/* Top row */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <span className="text-white/20 text-xs">
                    {f.number}
                  </span>

                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: f.accentGlow,
                      color: f.accentColor,
                    }}
                  >
                    {f.proof}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-semibold mb-3 relative z-10">
                  {f.title}
                </h3>

                {/* Desc */}
                <p className="text-white/50 text-sm leading-relaxed relative z-10">
                  {f.description}
                </p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition duration-500"
                  style={{
                    background: `linear-gradient(90deg,transparent,${f.accentColor},transparent)`,
                  }}
                />
              </motion.div>
            </Tilt3D>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
