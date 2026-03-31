'use client'

const testimonials = [
  {
    quote:
      'CloseFlow AI doubled our booking rate in the first week. We went from missing 40% of leads to booking 85% automatically. It\'s like having a full sales team working 24/7.',
    name: 'James Martinez',
    role: 'CEO',
    company: 'Elite Home Services',
    initials: 'JM',
    accentColor: '#60a5fa',
    accentGlow: 'rgba(96,165,250,0.12)',
    avatarGrad: 'linear-gradient(135deg,#3b82f6,#6366f1)',
  },
  {
    quote:
      'Saved us 15+ hours every week on follow-up. The AI handles objections more naturally than some of our senior reps. Our close rate jumped 3.2× in just one month.',
    name: 'Sarah Roberts',
    role: 'Founder & CEO',
    company: 'Apex Consulting',
    initials: 'SR',
    accentColor: '#34d399',
    accentGlow: 'rgba(52,211,153,0.12)',
    avatarGrad: 'linear-gradient(135deg,#10b981,#0d9488)',
  },
  {
    quote:
      'Our no-show rate dropped from 30% to 8%. Leads are properly nurtured until they show up. The calendar sync and intelligent qualification have been game-changing for our practice.',
    name: 'Tom Kim',
    role: 'Practice Manager',
    company: 'Summit Dental',
    initials: 'TK',
    accentColor: '#a78bfa',
    accentGlow: 'rgba(167,139,250,0.12)',
    avatarGrad: 'linear-gradient(135deg,#8b5cf6,#a855f7)',
  },
]

const stats = [
  { value: '4.98', label: 'out of 5', sub: 'from 187 verified users', accent: '#fbbf24' },
  { value: '2,400+', label: 'businesses', sub: 'actively using CloseFlow', accent: '#34d399' },
  { value: '3.2×', label: 'avg booking lift', sub: 'across all industries', accent: '#60a5fa' },
]

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden bg-[#050810]">

      {/* ── Ambient layers ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(96,165,250,0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_50%_at_0%_65%,rgba(52,211,153,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_50%_at_100%_60%,rgba(167,139,250,0.04),transparent)]" />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.032]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Hairlines */}
      <div className="absolute top-0    left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 lg:mb-24">

          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="h-px flex-1 max-w-[80px] sm:max-w-[110px] bg-gradient-to-r from-transparent to-white/12" />
            <span style={{
              fontSize: 'clamp(0.58rem, 0.9vw, 0.68rem)',
              color: 'rgba(255,255,255,0.32)',
              fontFamily: "'Sora', sans-serif",
              letterSpacing: '0.22em',
              fontWeight: 500,
            }}>
              REAL CUSTOMERS · REAL RESULTS
            </span>
            <div className="h-px flex-1 max-w-[80px] sm:max-w-[110px] bg-gradient-to-l from-transparent to-white/12" />
          </div>

          <h2
            className="font-semibold text-white mb-4 sm:mb-5"
            style={{
              fontSize: 'clamp(2.1rem, 4.8vw, 3.75rem)',
              fontFamily: "'Sora', sans-serif",
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
            }}>
            Don't just take{' '}
            <span style={{
              background: 'linear-gradient(135deg,#60a5fa 0%,#818cf8 55%,#a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              our word for it
            </span>
          </h2>

          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-white/10" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <p style={{
            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: "'Sora', sans-serif",
            lineHeight: 1.7,
          }}>
            See how businesses like yours are transforming their sales pipelines{' '}
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>with CloseFlow AI.</span>
          </p>
        </div>

        {/* ── Testimonial cards ── */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-2xl sm:rounded-[1.4rem] p-7 sm:p-8 flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
              style={{
                background: 'linear-gradient(145deg,rgba(255,255,255,0.052) 0%,rgba(255,255,255,0.014) 100%)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(255,255,255,0.075)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset,0 20px 50px rgba(0,0,0,0.35)',
              }}>

              {/* Per-card hover glow */}
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-[1.4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 25% 20%,${t.accentGlow},transparent 65%)`,
                  border: `1px solid ${t.accentColor}33`,
                }}
              />

              {/* Decorative open-quote */}
              <div
                className="mb-5 sm:mb-6 relative z-10 select-none"
                style={{
                  fontSize: 'clamp(2.8rem, 4vw, 3.5rem)',
                  color: t.accentColor,
                  opacity: 0.2,
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1,
                }}>
                "
              </div>

              {/* Quote body */}
              <blockquote
                className="flex-grow relative z-10 mb-8 sm:mb-10"
                style={{
                  fontSize: 'clamp(0.84rem, 1.15vw, 0.95rem)',
                  color: 'rgba(255,255,255,0.62)',
                  fontFamily: "'Sora', sans-serif",
                  lineHeight: 1.75,
                  fontStyle: 'normal',
                }}>
                {t.quote}
              </blockquote>

              {/* Hairline */}
              <div
                className="relative z-10 h-px w-full mb-6"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)' }}
              />

              {/* Author row */}
              <div className="flex items-center gap-3.5 relative z-10 mt-auto">

                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0 font-semibold text-white"
                  style={{
                    width: 'clamp(36px, 3vw, 42px)',
                    height: 'clamp(36px, 3vw, 42px)',
                    background: t.avatarGrad,
                    fontSize: 'clamp(0.68rem, 0.9vw, 0.76rem)',
                    boxShadow: `0 4px 14px ${t.accentGlow}`,
                    letterSpacing: '0.05em',
                  }}>
                  {t.initials}
                </div>

                <div>
                  <div
                    className="font-semibold text-white"
                    style={{
                      fontSize: 'clamp(0.82rem, 1.1vw, 0.92rem)',
                      fontFamily: "'Sora', sans-serif",
                      letterSpacing: '-0.01em',
                    }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.68rem, 0.88vw, 0.75rem)',
                    color: 'rgba(255,255,255,0.3)',
                    fontFamily: "'Sora', sans-serif",
                    marginTop: '1px',
                  }}>
                    {t.role}{' '}
                    <span style={{ color: t.accentColor, opacity: 0.7 }}>·</span>{' '}
                    {t.company}
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg,transparent,${t.accentColor}55,transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* ── Stats trust bar ── */}
        <div className="mt-12 sm:mt-16 lg:mt-20">

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10 sm:mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/6" />
            <span style={{
              fontSize: 'clamp(0.56rem, 0.8vw, 0.64rem)',
              color: 'rgba(255,255,255,0.2)',
              fontFamily: "'Sora', sans-serif",
              letterSpacing: '0.2em',
              fontWeight: 500,
            }}>
              BY THE NUMBERS
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/6" />
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {stats.map((s) => (
              <div
                key={s.value}
                className="text-center rounded-xl sm:rounded-2xl py-6 sm:py-7 px-4"
                style={{
                  background: 'linear-gradient(145deg,rgba(255,255,255,0.036),rgba(255,255,255,0.010))',
                  border: '1px solid rgba(255,255,255,0.055)',
                }}>

                <div
                  className="font-semibold leading-none mb-1"
                  style={{
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                    fontFamily: "'Sora', sans-serif",
                    letterSpacing: '-0.04em',
                    color: s.accent,
                    textShadow: `0 0 24px ${s.accent}44`,
                  }}>
                  {s.value}
                </div>

                <div
                  className="font-medium text-white"
                  style={{
                    fontSize: 'clamp(0.72rem, 1vw, 0.82rem)',
                    fontFamily: "'Sora', sans-serif",
                    marginTop: '4px',
                    opacity: 0.7,
                  }}>
                  {s.label}
                </div>

                <div style={{
                  fontSize: 'clamp(0.62rem, 0.82vw, 0.7rem)',
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: "'Sora', sans-serif",
                  marginTop: '3px',
                  letterSpacing: '0.02em',
                }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Press logos */}
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
            <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-r from-transparent to-white/6" />
            <div className="flex items-center gap-6 sm:gap-10">
              {['Forbes', 'Salesforce', 'TechCrunch'].map((name) => (
                <span
                  key={name}
                  style={{
                    fontSize: 'clamp(0.7rem, 1vw, 0.82rem)',
                    color: 'rgba(255,255,255,0.2)',
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}>
                  {name}
                </span>
              ))}
            </div>
            <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-l from-transparent to-white/6" />
          </div>
        </div>
      </div>
    </section>
  )
}