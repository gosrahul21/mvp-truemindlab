'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/framer-utils'
import { Tilt3D } from '@/lib/Tilt3D'

export default function ProblemSection() {
  const problems = [
    {
      stat: "78%",
      statColor: "#f87171",
      title: "Leads Go Cold Fast",
      description:
        "Your leads go cold within minutes. If you're not first to respond, you've already lost the deal.",
    },
    {
      stat: "6.5 hrs",
      statColor: "#fbbf24",
      title: "Manual Work is Killing Time",
      description:
        "Your team spends hours on repetitive follow-ups that should be automated — slowing growth and burning energy.",
    },
    {
      stat: "3.2×",
      statColor: "#a78bfa",
      title: "Inconsistent Follow-Ups",
      description:
        "Different reps, different messages. Missed objections, lost context — and deals slipping through.",
    },
  ]

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="relative py-24 bg-[#050810] overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.04),transparent)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">

          <div className="text-xs tracking-[0.3em] text-gray-500 mb-6">
            THE REAL PROBLEM
          </div>

          <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
            You’re Losing Leads{' '}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Every Day
            </span>
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto">
            While you're busy, your competitors are responding instantly.
            The result? Lost revenue and wasted opportunities.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          className="grid md:grid-cols-3 gap-6"
        >
          {problems.map((p, i) => (
            <Tilt3D key={i} maxTilt={6} scale={1.01} speed={400}>
<motion.div
  variants={staggerItem}
  className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
  style={{
    background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)',
  }}
>
  {/* 🔥 Subtle ambient glow (rest state) */}
  <div
    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    style={{
      background: `radial-gradient(circle at 30% 20%, ${p.statColor}15, transparent 60%)`,
    }}
  />

  {/* Optional softer base glow */}
  <div
    className="absolute inset-0 opacity-20 pointer-events-none"
    style={{
      background: `radial-gradient(circle at 80% 80%, ${p.statColor}08, transparent 70%)`,
    }}
  />

  {/* Content */}
  <div className="relative z-10">
    
    {/* Stat */}
    <div
      className="text-3xl font-semibold mb-3"
      style={{ color: p.statColor }}
    >
      {p.stat}
    </div>

    {/* Title */}
    <h3 className="text-xl font-semibold text-white mb-3">
      {p.title}
    </h3>

    {/* Description */}
    <p className="text-gray-400 text-sm leading-relaxed">
      {p.description}
    </p>

  </div>
</motion.div>

            </Tilt3D>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">
            The difference between missing a deal and closing it is often just minutes.
          </p>

          <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:opacity-90 transition">
            See How CloseFlow Fixes This →
          </button>
        </motion.div>

      </div>
    </motion.section>
  )
}
