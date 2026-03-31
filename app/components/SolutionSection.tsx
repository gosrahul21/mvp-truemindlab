'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/framer-utils'
import { MagneticButton } from '@/lib/MagneticButton'

export default function SolutionSection() {
  const solutions = [
    {
      title: 'Instant Lead Response',
      description:
        'Every lead is contacted within seconds via SMS, AI voice, and email — no delays, no missed opportunities.',
      stat: '< 5 sec',
    },
    {
      title: 'AI Qualification Engine',
      description:
        'Automatically asks the right questions, handles objections, and filters serious buyers from time-wasters.',
      stat: '24/7',
    },
    {
      title: 'Auto Booking System',
      description:
        'Hot prospects are instantly booked into your calendar — without manual follow-up or back-and-forth.',
      stat: 'Zero effort',
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
      {/* Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(96,165,250,0.06),transparent)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl font-semibold text-white leading-tight"
          >
            Turn missed leads into{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              booked revenue
            </span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-gray-400 mt-5 text-lg"
          >
            CloseFlow AI responds instantly, qualifies every lead, and books appointments — automatically.
          </motion.p>
        </motion.div>

        {/* Solution Cards */}
        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {solutions.map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                style={{
                  background:
                    'radial-gradient(circle at 30% 20%, rgba(96,165,250,0.12), transparent 60%)',
                }}
              />

              <div className="relative z-10">
                {/* Stat */}
                <div className="text-blue-400 text-2xl font-semibold mb-3">
                  {item.stat}
                </div>

                {/* Title */}
                <h3 className="text-white text-xl font-semibold mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Flow Visualization */}
        <motion.div
          variants={fadeInUp}
          className="mt-20 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-400 text-sm">

            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              New Lead
            </div>

            <span>→</span>

            <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
              AI Follow-up
            </div>

            <span>→</span>

            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              Qualified
            </div>

            <span>→</span>

            <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300">
              Booked Call
            </div>

          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 text-center"
        >
          <MagneticButton
            onClick={() => window.location.href = '/signup'}
            className="px-8 py-4 rounded-2xl font-semibold text-black bg-white hover:scale-105 transition"
          >
            Get Started Free →
          </MagneticButton>

          <p className="text-gray-500 text-sm mt-4">
            Setup takes less than 10 minutes
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}
