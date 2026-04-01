'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/framer-utils'
import Layout from '../components/Layout'
import { useChoosePlan } from '@/hooks/useChoosePlan'

function ChoosePlanContent() {
  const {
    plans,
    loading,
    submitting,
    error,
    selectedPlanId,
    setSelectedPlanId,
    handleSubscribe,
  } = useChoosePlan()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="min-h-screen flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 bg-[#050810]"
    >
      <div className="max-w-7xl w-full space-y-12">
        <div className="text-center">
          <motion.h2 variants={fadeInUp} className="text-4xl font-extrabold text-white tracking-tight">
            Choose your plan
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Scale your AI infrastructure with the plan that fits your business needs. Upgrade or downgrade at any time.
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full"
            />
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            className="flex flex-col lg:flex-row justify-center items-stretch gap-8 pt-8"
          >
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              
              return (
                <motion.div
                  key={plan.id}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`
                    relative flex flex-col justify-between w-full lg:w-96 rounded-3xl p-8 cursor-pointer transition-all duration-300
                    backdrop-blur-xl border border-white/10
                    ${isSelected 
                      ? 'bg-gradient-to-b from-[#1a233a] to-[#0a101f] ring-2 ring-blue-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]' 
                      : 'bg-[#0f1524] hover:bg-[#161f33]'
                    }
                  `}
                >
                  {plan.price_monthly === 0 && (
                    <div className="absolute top-0 right-8 transform -translate-y-1/2">
                      <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Default
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                      {plan.region === 'india' ? '₹' : '$'}{plan.price_monthly}
                      <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                    </div>
                    
                    <ul className="mt-8 space-y-4">
                      {plan.keyFeatures?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="ml-3 text-sm text-gray-300">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                      <div>
                        <span className="block text-gray-500">Contacts</span>
                        <span className="font-semibold text-white">{plan.contacts_limit.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">SMS / Voice</span>
                        <span className="font-semibold text-white">{plan.sms_limit} / {plan.voice_min_limit}m</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`mt-8 w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${
                    isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        <div className="flex justify-center pt-10 pb-20">
          <button
            onClick={handleSubscribe}
            disabled={submitting || !selectedPlanId || loading}
            className="group relative flex justify-center py-4 px-12 border border-transparent text-base font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.2)] hover:-translate-y-1"
          >
            {submitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'Save & Continue to Dashboard'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ChoosePlanPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="min-h-screen bg-[#050810] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      }>
        <ChoosePlanContent />
      </Suspense>
    </Layout>
  )
}
