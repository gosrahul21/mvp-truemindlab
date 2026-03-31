'use client'

import { motion } from 'framer-motion'

export default function SocialProof() {
  const stats = [
    { value: "500+", label: "Leads processed daily" },
    { value: "92%", label: "Qualification accuracy" },
    { value: "24/7", label: "Always-on follow-up" },
    { value: "3.2×", label: "Avg booking increase" },
  ]

  const logos = ["Calendly", "HubSpot", "Twilio", "Google"]

  return (
    <section className="py-20 bg-[#050810] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <div className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Logos (Trust) ── */}
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 mb-16 opacity-60">
          {logos.map((logo, i) => (
            <motion.div
              key={logo}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-sm md:text-base text-gray-400 font-medium hover:opacity-100 transition"
            >
              {logo}
            </motion.div>
          ))}
        </div>

        {/* ── Testimonial ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            “CloseFlow AI increased our booked appointments by over 3x in just 2 weeks.
            We don’t worry about follow-ups anymore — it just works.”
          </p>

          <div className="mt-6 text-sm text-gray-500">
            <span className="font-semibold text-white">Amit Sharma</span> · Founder, Growth Dental
          </div>
        </motion.div>

      </div>
    </section>
  )
}
