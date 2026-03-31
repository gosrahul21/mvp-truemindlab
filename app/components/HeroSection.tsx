'use client'

import { useRouter } from 'next/navigation'
import { PlayIcon } from '@heroicons/react/24/solid'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  textReveal,
} from '@/lib/framer-utils'
import { MagneticButton } from '@/lib/MagneticButton'
import { Tilt3D } from '@/lib/Tilt3D'

export default function HeroSection() {
  const router = useRouter()
  const containerRef = useRef(null)

  // ✅ Better: scoped scroll instead of global
  const { scrollY } = useScroll({ target: containerRef })

  const orb1Y = useTransform(scrollY, [0, 1000], [0, -120])
  const orb2Y = useTransform(scrollY, [0, 1000], [0, -80])

  const handleDemoScroll = () => {
    const el = document.getElementById('demo')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.section
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#050810]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(96,165,250,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_80%_70%,rgba(139,92,246,0.12),transparent)]" />

      {/* Reduced blur for performance */}
      <motion.div
        className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-blue-500/10 blur-[60px]"
        style={{ y: orb1Y }}
      />
      <motion.div
        className="absolute bottom-1/3 right-[10%] w-96 h-96 rounded-full bg-violet-500/10 blur-[60px]"
        style={{ y: orb2Y }}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center min-h-[calc(100vh-80px)] py-12"
        >
          {/* LEFT */}
          <div className="space-y-8">

            {/* Status */}
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Now booking 3.2× more meetings on autopilot
            </motion.div>

            {/* 🔥 Improved Headline */}
            <motion.h1
              variants={textReveal}
              className="font-semibold tracking-tight text-white leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Turn Every Lead Into a{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Booked Appointment
              </span>{' '}
              — Automatically
            </motion.h1>

            {/* 🔥 Improved Subtext */}
            <motion.p
              variants={staggerItem}
              className="text-gray-400 max-w-lg text-lg"
            >
              CloseFlow AI instantly follows up via SMS, AI voice, and email —
              qualifying leads and booking appointments for you, 24/7.
            </motion.p>

            {/* ✅ Who it's for */}
            <motion.p variants={staggerItem} className="text-sm text-gray-500">
              Built for med spas, dentists, agencies & local service businesses
            </motion.p>

            {/* CTA */}
            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4">
              
              {/* Primary */}
              <MagneticButton
                onClick={() => router.push('/signup')}
                className="px-8 py-4 font-semibold rounded-xl text-black bg-white hover:opacity-90 transition"
              >
                Start Free Trial — Takes 2 Minutes →
              </MagneticButton>

              {/* Secondary */}
              <MagneticButton
                onClick={handleDemoScroll}
                className="px-8 py-4 text-white border border-white/20 rounded-xl flex items-center gap-2 hover:bg-white/5 transition"
              >
                <PlayIcon className="w-5 h-5" />
                Watch Demo
              </MagneticButton>
            </motion.div>

            {/* Trust */}
            <motion.div variants={staggerItem} className="flex items-center gap-6 pt-4">
              
              <div>
                <div className="text-white font-semibold">2,400+</div>
                <div className="text-gray-500 text-xs">businesses automated</div>
              </div>

              <div>
                <div className="text-white font-semibold">4.98 ★</div>
                <div className="text-gray-500 text-xs">187 reviews</div>
              </div>

              <div className="text-emerald-400 text-sm">
                ↑ 3.2× booking rate
              </div>
            </motion.div>
          </div>

          {/* RIGHT (keep your existing dashboard — just one tweak below) */}
          <div className="relative">

            <Tilt3D maxTilt={6} scale={1.01} speed={500}>
              <div className="rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl">

                {/* 🔥 Add REAL metric */}
                <div className="text-emerald-400 text-sm mb-2">
                  +18 appointments today
                </div>

                <div
  className="relative rounded-3xl overflow-hidden"
  style={{
    background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow:
      '0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(96,165,250,0.05)',
  }}>

  {/* Browser chrome */}
  <div
    className="h-10 sm:h-11 flex items-center px-4 gap-2"
    style={{ background: 'rgba(0,0,0,0.4)' }}>
    <div className="flex gap-1.5">
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/70" />
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70" />
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/70" />
    </div>
    <div
      className="flex-1 mx-4 sm:mx-8 h-5 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] text-gray-500 border border-white/5"
      style={{ background: 'rgba(255,255,255,0.03)' }}>
      closeflow.ai/dashboard
    </div>
  </div>

  {/* Dashboard interior */}
  <div
    className="relative overflow-hidden"
    style={{ aspectRatio: '16/13' }}>

    {/* Interior background */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(145deg, rgba(15,20,40,0.95) 0%, rgba(8,12,30,0.98) 100%)',
      }}
    />

    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-12 gap-3 sm:gap-5 lg:gap-6 h-full">

        {/* Sidebar */}
        <div
          className="col-span-3 rounded-xl sm:rounded-2xl p-3 sm:p-5 space-y-4 sm:space-y-6"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
          }}>
          <div className="h-2 sm:h-3 w-14 sm:w-20 bg-blue-500 rounded" />
          <div className="space-y-2.5 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-1.5 sm:h-2.5 rounded"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  width: `${[80, 65, 90, 55, 70][i]}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="col-span-9 space-y-3 sm:space-y-5 lg:space-y-6">

          {/* Top bar */}
          <div className="flex justify-between items-center gap-2">
            <div
              className="h-6 sm:h-8 flex-1 max-w-[11rem] sm:max-w-[13rem] rounded-xl"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            />
            <div
              className="px-2 sm:px-4 py-1 sm:py-1.5 text-emerald-400 text-[8px] sm:text-[10px] font-medium rounded-xl flex items-center gap-1 sm:gap-1.5 shrink-0"
              style={{
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.15)',
              }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              27 active
            </div>
          </div>

          {/* Lead cards */}
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {[
              { grad: 'from-blue-500 to-indigo-600', tag: 'AI Voice', status: 'Booked', statusColor: 'text-emerald-400', statusBg: 'rgba(52,211,153,0.08)', statusBorder: 'rgba(52,211,153,0.2)' },
              { grad: 'from-violet-500 to-purple-600', tag: 'SMS', status: 'Qualifying', statusColor: 'text-blue-300', statusBg: 'rgba(96,165,250,0.08)', statusBorder: 'rgba(96,165,250,0.2)' },
              { grad: 'from-emerald-500 to-teal-600', tag: 'Email', status: 'Follow-up', statusColor: 'text-amber-400', statusBg: 'rgba(251,191,36,0.08)', statusBorder: 'rgba(251,191,36,0.2)' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 flex gap-2 sm:gap-3 lg:gap-4 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                }}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br ${item.grad} flex-shrink-0`} />
                <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                  <div className="h-2 sm:h-2.5 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  <div className="h-1.5 sm:h-2 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <div className="flex gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                    <div
                      className="px-2 sm:px-3 py-0.5 text-gray-400 text-[8px] sm:text-[10px] rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {item.tag}
                    </div>
                    <div
                      className={`px-2 sm:px-3 py-0.5 ${item.statusColor} text-[8px] sm:text-[10px] rounded-full`}
                      style={{ background: item.statusBg, border: `1px solid ${item.statusBorder}` }}>
                      {item.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Floating notification badge */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-2xl"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset, 0 16px 40px rgba(0,0,0,0.5)',
      }}>
      <div className="text-emerald-400 text-[10px] sm:text-xs font-medium flex items-center gap-1.5">
        <span>🎯</span> Lead Qualified
      </div>
      <div className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white mt-0.5 sm:mt-1">Sarah M.</div>
      <div className="text-gray-400 text-[10px] sm:text-xs">Booked · Tomorrow 2:30 PM</div>
    </motion.div>

    {/* Bottom glow */}
    <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
  </div>
</div>

              </div>
            </Tilt3D>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        SCROLL ↓
      </motion.div>
    </motion.section>
  )
}




