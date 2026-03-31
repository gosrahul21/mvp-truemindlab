'use client'

import { useState } from 'react'

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(0)

  const faqs = [
    {
      question: "How fast can I start seeing results?",
      answer:
        "Most teams start booking more calls within the first week. Setup takes ~10 minutes, and the AI begins following up with leads immediately.",
    },
    {
      question: "Will this replace my sales team?",
      answer:
        "No — it makes them more effective. CloseFlow handles follow-ups, qualification, and booking so your team can focus on closing deals.",
    },
    {
      question: "How is this different from tools like HubSpot or Salesforce?",
      answer:
        "CRMs store data. CloseFlow drives revenue. We automatically follow up, qualify leads, and book meetings — without manual effort.",
    },
    {
      question: "Can I control what the AI says?",
      answer:
        "Yes. You can fully customize scripts, tone, and responses. You can also train the AI using your best-performing conversations.",
    },
    {
      question: "What happens if a lead replies?",
      answer:
        "CloseFlow responds instantly, handles objections, and books meetings directly into your calendar — or routes hot leads to your team.",
    },
    {
      question: "Is there any long-term commitment?",
      answer:
        "No. You can cancel anytime. Start free, and upgrade only when you see results.",
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Questions before you try?
          </h2>
          <p className="mt-4 text-zinc-500 text-lg">
            Everything you need to know before getting started
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-3">

          {faqs.map((faq, i) => {
            const isOpen = open === i

            return (
              <div
                key={i}
                className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden"
              >

                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>

                  <span className="text-xl text-gray-400">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  className={`px-6 transition-all duration-300 ${
                    isOpen ? 'pb-5 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

              </div>
            )
          })}
        </div>

        {/* TRUST + CTA */}
        <div className="text-center mt-16">
          <p className="text-sm text-zinc-500 mb-4">
            No credit card required · Setup in minutes
          </p>

          <a
            href="/signup"
            className="inline-block px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition"
          >
            Start Free
          </a>
        </div>

      </div>
    </section>
  )
}

export default FaqSection
