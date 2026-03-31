'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem, textReveal } from '@/lib/framer-utils'
import { Tilt3D } from '@/lib/Tilt3D'

const benefits = [
  {
    metric: '3.2×',
    label: 'More booked meetings',
    description:
      'Turn inbound traffic into pipeline. AI follows up instantly, qualifies leads, and books meetings without human effort.',
    accentColor: '#60a5fa',
    accentGlow: 'rgba(96,165,250,0.14)',
    borderHover: 'rgba(96,165,250,0.25)',
  },
  {
    metric: '20+ hrs',
    label: 'Saved every week',
    description:
      'No more manual follow-ups, scheduling, or CRM updates. Your team focuses only on closing.',
    accentColor: '#34d399',
    accentGlow: 'rgba(52,211,153,0.14)',
    borderHover: 'rgba(52,211,153,0.25)',
  },
  {
    metric: '94%',
    label: 'Response rate',
    description:
      'Multi-channel outreach (SMS, voice, email) ensures leads respond — fast and consistently.',
    accentColor: '#a78bfa',
    accentGlow: 'rgba(167,139,250,0.14)',
    borderHover: 'rgba(167,139,250,0.25)',
  },
]

const testimonials = [
  {
    quote: 'We went from missed leads to a fully automated pipeline.',
    author: 'Sarah Chen',
    role: 'Founder · Lumora',
  },
  {
    quote: 'Meetings doubled in 3 weeks. No extra hires.',
    author: 'Marcus Rivera',
    role: 'CEO · Vertex Sales',
  },
  {
    quote: 'It feels like having a 24/7 sales team.',
    author: 'Priya Patel',
    role: 'Head of Growth · Nova',
  },
]

export default function BenefitsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={fadeInUp}
      className="relative py-24 lg:py-36 overflow-hidden bg-[#050810]"
    >
      {/* Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(52,211,153,0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_45%_at_0%_60%,rgba(96,165,250,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_45%_at_100%_70%,rgba(167,139,250,0.04),transparent)]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Hairlines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <motion.div variants={staggerItem} className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/12" />
            <span className="text-[10px] tracking-[0.25em] text-white/40">
              RESULTS
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/12" />
          </motion.div>

          <motion.h2
            variants={textReveal}
            className="text-white font-semibold mb-4"
            style={{
              fontSize: 'clamp(2.2rem,5vw,3.6rem)',
              letterSpacing: '-0.03em',
            }}
          >
            More pipeline.{' '}
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Less work.
            </span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-white/50 max-w-lg mx-auto"
          >
            CloseFlow replaces manual follow-ups with AI that engages, qualifies,
            and books — automatically.
          </motion.p>
        </motion.div>

        {/* BENEFITS */}
        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-5 lg:gap-6"
        >
          {benefits.map((b) => (
            <Tilt3D key={b.label} maxTilt={8} scale={1.02} speed={500}>
              <motion.div
                variants={staggerItem}
                className="group relative rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
                style={{
                  background:
                    'linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))',
                  backdropFilter: 'blur(26px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                  style={{
                    background: `radial-gradient(circle at 30% 20%,${b.accentGlow},transparent 70%)`,
                  }}
                />

                {/* Metric */}
                <div
                  className="text-4xl font-semibold mb-4"
                  style={{
                    color: b.accentColor,
                    textShadow: `0 0 30px ${b.accentGlow}`,
                  }}
                >
                  {b.metric}
                </div>

                {/* Label */}
                <h3 className="text-white font-medium mb-2">
                  {b.label}
                </h3>

                {/* Desc */}
                <p className="text-white/50 text-sm leading-relaxed">
                  {b.description}
                </p>

                {/* Bottom glow line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition"
                  style={{
                    background: `linear-gradient(90deg,transparent,${b.accentColor},transparent)`,
                  }}
                />
              </motion.div>
            </Tilt3D>
          ))}
        </motion.div>

        {/* TRUST STRIP (VERY IMPORTANT YC PATTERN) */}
        <motion.div
          variants={staggerItem}
          className="mt-16 text-center"
        >
          <p className="text-white/30 text-xs tracking-widest mb-6">
            TRUSTED BY FAST-GROWING TEAMS
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-white/20 text-sm">
            <span>Startup A</span>
            <span>Startup B</span>
            <span>Startup C</span>
            <span>Startup D</span>
          </div>
        </motion.div>

        {/* TESTIMONIALS */}
        <motion.div
          variants={staggerContainer}
          className="mt-16 grid sm:grid-cols-3 gap-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="group p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition"
            >
              <p className="text-white mb-4 leading-snug">
                “{t.quote}”
              </p>

              <div className="text-sm text-white/60">
                {t.author}
              </div>
              <div className="text-xs text-white/30">
                {t.role}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.section>
  )
}
