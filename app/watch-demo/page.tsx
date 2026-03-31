'use client'

import { useRouter } from 'next/navigation'
import { PlayCircleIcon } from '@heroicons/react/24/solid'
import Layout from '../components/Layout'

export default function DemoSection() {
  const router = useRouter()

  return (
    <Layout>
      <section id="demo" className="py-24 lg:py-32 bg-zinc-950 relative overflow-hidden">
      
        {/* Background accent glows */}
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_40%,rgba(59,130,246,0.12),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="uppercase tracking-[2px] text-xs font-medium text-emerald-400">LIVE DEMO</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-semibold tracking-tighter text-white leading-none">
                Watch CloseFlow AI<br />
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">in real time</span>
              </h2>

              <p className="text-xl text-zinc-400 max-w-lg">
                See how our AI voice agent handles real conversations, qualifies leads, overcomes objections, and books meetings — completely autonomously.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={() => router.push('/demo')}
                  className="group flex items-center justify-center gap-4 bg-white text-black font-semibold px-10 py-5 rounded-2xl text-lg hover:shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-0.5"
                >
                  <PlayCircleIcon className="w-7 h-7" />
                  Watch 2-Minute Demo
                </button>

                <button
                  onClick={() => router.push('/signup')}
                  className="px-10 py-5 border border-white/30 hover:border-white/60 text-white font-medium rounded-2xl transition-all hover:bg-white/5"
                >
                  Try it Free
                </button>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  No credit card required
                </div>
                <div>Works with your existing tools</div>
              </div>
            </div>

            {/* Right Visual - Premium Demo Mock */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 bg-zinc-900">
                {/* Fake Browser Header */}
                <div className="h-12 bg-zinc-950 flex items-center px-5 gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 mx-12 h-7 bg-zinc-900 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-zinc-500 font-mono">closeflow.ai/live-demo</span>
                  </div>
                </div>

                {/* Demo Video / Visual Area */}
                <div className="aspect-video bg-gradient-to-br from-zinc-800 to-black relative flex items-center justify-center overflow-hidden">
                  {/* Central Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div 
                      onClick={() => router.push('/demo')}
                      className="group cursor-pointer w-24 h-24 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    >
                      <PlayCircleIcon className="w-16 h-16 text-white group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>

                  {/* Simulated Dashboard UI */}
                  <div className="absolute inset-0 p-8 space-y-6">
                    {/* Conversation Header */}
                    <div className="flex items-center justify-between bg-zinc-900/70 backdrop-blur rounded-2xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl" />
                        <div>
                          <div className="text-white font-medium">Alex Rivera • Lead</div>
                          <div className="text-emerald-400 text-xs flex items-center gap-1">
                            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            Live AI Voice Call
                          </div>
                        </div>
                      </div>
                      <div className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-xl">
                        Booking in progress
                      </div>
                    </div>

                    {/* Transcript Simulation */}
                    <div className="space-y-6">
                      <div className="bg-zinc-900/80 backdrop-blur p-5 rounded-2xl max-w-[85%]">
                        <div className="text-zinc-400 text-sm">AI Agent:</div>
                        <div className="text-white mt-1">"Hi Alex, I noticed you're interested in our premium plan. Would next Tuesday at 3 PM work for a quick demo?"</div>
                      </div>

                      <div className="bg-blue-600/10 backdrop-blur p-5 rounded-2xl max-w-[75%] ml-auto">
                        <div className="text-blue-400 text-sm">Lead:</div>
                        <div className="text-white mt-1">"Tuesday at 3 sounds good!"</div>
                      </div>
                    </div>
                  </div>

                  {/* Channel indicators */}
                  <div className="absolute bottom-8 left-8 flex gap-3">
                    <div className="px-4 py-1.5 bg-white/10 backdrop-blur text-xs rounded-full text-white flex items-center gap-2">
                      📞 Voice
                    </div>
                    <div className="px-4 py-1.5 bg-white/10 backdrop-blur text-xs rounded-full text-white flex items-center gap-2">
                      💬 SMS
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <div className="font-semibold text-white">Lead Qualified</div>
                    <div className="text-emerald-400 text-sm">Appointment Booked</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}