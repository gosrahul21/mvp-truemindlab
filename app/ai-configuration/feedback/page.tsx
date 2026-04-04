'use client'

import { useState } from 'react'
import { FeedbackIcon, ChevronDownIcon } from '@/app/components/dashboard/PulseIcons'

type Review = {
  id: string
  name: string
  rating: number
  text: string
  channel: string
  timeAgo: string
  replied: boolean
}

const demoReviews: Review[] = [
  { id: '1', name: 'Ananya Mehta', rating: 5, text: 'Priya was so helpful and booked my appointment in under 2 minutes. Loved it!', channel: 'whatsapp', timeAgo: '2h ago', replied: true },
  { id: '2', name: 'Rohit Sharma', rating: 4, text: 'Good experience overall. Would appreciate faster confirmation though.', channel: 'sms', timeAgo: '1d ago', replied: false },
  { id: '3', name: 'Sunita Rao', rating: 3, text: 'The AI repeated itself a couple of times. Human staff were great though.', channel: 'whatsapp', timeAgo: '3d ago', replied: false },
]

export default function FeedbackPage() {
  const [reviews, setReviews] = useState<Review[]>(demoReviews)
  const [collectEnabled, setCollectEnabled] = useState(true)
  const [autoAskAfter, setAutoAskAfter] = useState('appointment')
  const [reviewLink, setReviewLink] = useState('https://g.page/r/citydental/review')
  const [feedbackMessage, setFeedbackMessage] = useState("Hi {name}, thanks for visiting City Dental! We'd love your feedback. How was your experience? Reply with a number 1-5 ⭐")

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  const markReplied = (id: string) =>
    setReviews(prev => prev.map(r => r.id === id ? { ...r, replied: true } : r))

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Feedback</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="pulse-btn pulse-btn-ghost">Export reviews</button>
          <button className="pulse-btn pulse-btn-primary">Save settings</button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-5 pb-24">
        {/* HERO */}
        <div className="pulse-card p-6 flex items-center gap-5 relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(61,214,140,0.08)_0%,transparent_70%)] pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3DD68C] to-[#22D3A8] flex items-center justify-center shrink-0 shadow-lg shadow-[#3dd68c1a]">
            <FeedbackIcon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-['Fraunces'] text-[22px] font-normal text-[#E8EBF2] tracking-[-0.02em]">
              Patient <em>feedback</em>
            </div>
            <div className="text-[12px] text-[#555D72] mt-1">Collect post-visit reviews automatically and route them to Google.</div>
          </div>
          <div className="flex gap-2">
            <div className="bg-[#171C28] border border-[#ffffff0f] rounded-lg px-4 py-2 min-w-[80px] flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#E8EBF2]">{avgRating}</span>
              <span className="text-[10px] text-[#555D72]">Avg rating</span>
            </div>
            <div className="bg-[#171C28] border border-[#ffffff0f] rounded-lg px-4 py-2 min-w-[80px] flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#E8EBF2]">{reviews.length}</span>
              <span className="text-[10px] text-[#555D72]">Collected</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 items-start">
          {/* Settings */}
          <div className="pulse-card">
            <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center justify-between">
              <div>
                <div className="text-[14px] font-medium text-[#E8EBF2]">Collection settings</div>
                <div className="text-[11px] text-[#555D72] mt-0.5">When and how feedback is requested</div>
              </div>
              <button
                onClick={() => setCollectEnabled(v => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${collectEnabled ? 'bg-[#4F7EFF]' : 'bg-[#1E2433]'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${collectEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Ask for feedback after</label>
                <select className="pulse-input appearance-none" value={autoAskAfter} onChange={e => setAutoAskAfter(e.target.value)}>
                  <option value="appointment">Appointment completed</option>
                  <option value="treatment">Treatment finished</option>
                  <option value="24h">24 hours after visit</option>
                  <option value="3d">3 days after visit</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Google Review link</label>
                <input className="pulse-input" value={reviewLink} onChange={e => setReviewLink(e.target.value)} placeholder="https://g.page/r/..." />
                <span className="text-[10px] text-[#555D72]">4 & 5 star responses are routed here automatically.</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Feedback request message</label>
                <textarea
                  className="pulse-input min-h-[88px] resize-none font-mono text-[12px]"
                  value={feedbackMessage}
                  onChange={e => setFeedbackMessage(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Smart routing */}
          <div className="flex flex-col gap-5">
            <div className="pulse-card">
              <div className="px-5 py-4 border-b border-[#ffffff0f]">
                <div className="text-[14px] font-medium text-[#E8EBF2]">Smart routing</div>
                <div className="text-[11px] text-[#555D72] mt-0.5">What happens with different star ratings</div>
              </div>
              <div className="p-5 flex flex-col gap-2">
                {[
                  { stars: '⭐⭐⭐⭐⭐ 5 stars', action: 'Send Google Review link', color: '#3DD68C' },
                  { stars: '⭐⭐⭐⭐ 4 stars', action: 'Send Google Review link', color: '#22D3A8' },
                  { stars: '⭐⭐⭐ 3 stars', action: 'Ask what went wrong (private)', color: '#F5A623' },
                  { stars: '⭐⭐ 1-2 stars', action: 'Alert clinic manager immediately', color: '#FF6B6B' },
                ].map(row => (
                  <div key={row.stars} className="flex items-center gap-3 p-3 bg-[#171C28] border border-[#ffffff0f] rounded-lg">
                    <span className="text-[12px] w-32 shrink-0 font-medium text-[#8B92A8]">{row.stars}</span>
                    <div className="w-px h-5 bg-[#ffffff0f]" />
                    <span className="text-[12px]" style={{ color: row.color }}>{row.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating distribution */}
            <div className="pulse-card">
              <div className="px-5 py-4 border-b border-[#ffffff0f]">
                <div className="text-[14px] font-medium text-[#E8EBF2]">Rating distribution</div>
              </div>
              <div className="p-5 flex flex-col gap-2.5">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-[11px] text-[#555D72] w-6">{star}★</span>
                      <div className="flex-1 h-2 bg-[#1E2433] rounded-full overflow-hidden">
                        <div className="h-2 bg-[#3DD68C] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-[#555D72] w-5 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div className="pulse-card">
          <div className="px-5 py-4 border-b border-[#ffffff0f]">
            <div className="text-[14px] font-medium text-[#E8EBF2]">Recent feedback</div>
          </div>
          <div className="divide-y divide-[#ffffff08]">
            {reviews.map(review => (
              <div key={review.id} className="px-5 py-4 flex items-start gap-4 hover:bg-[#ffffff02] transition">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F7EFF] to-[#A78BFA] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-medium text-[#E8EBF2]">{review.name}</span>
                    <span className="text-[11px] text-[#F5A623]">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span className="text-[10px] text-[#555D72]">{review.timeAgo} · via {review.channel}</span>
                  </div>
                  <div className="text-[12px] text-[#8B92A8] mt-1 line-clamp-2">{review.text}</div>
                </div>
                {!review.replied ? (
                  <button
                    onClick={() => markReplied(review.id)}
                    className="shrink-0 pulse-btn pulse-btn-ghost !text-[11px] !py-1.5 !px-3"
                  >
                    Reply
                  </button>
                ) : (
                  <span className="shrink-0 text-[10px] font-medium text-[#3DD68C] px-2 py-1 rounded-full bg-[#3dd68c10] border border-[#3dd68c30]">Replied</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-[240px] h-[64px] bg-[#111520] border-t border-[#ffffff0f] flex items-center justify-between px-7 z-[60]">
          <span className="text-[12px] text-[#555D72]">High ratings are auto-routed to Google. Low ratings trigger a private recovery flow.</span>
          <div className="flex gap-2">
            <button className="pulse-btn pulse-btn-ghost">Discard</button>
            <button className="pulse-btn pulse-btn-primary">Save settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
