'use client'

import { useState } from 'react'
import { FaLink, FaBuilding, FaDollarSign, FaShareAlt } from 'react-icons/fa'

const referralStats = [
  { label: 'Referral Link Clicks', value: '142', icon: <FaLink className="h-5 w-5 text-indigo-600 dark:text-indigo-300" /> },
  { label: 'Referred Organizations', value: '18', icon: <FaBuilding className="h-5 w-5 text-green-600 dark:text-green-300" /> },
  { label: 'Pending Rewards', value: '$540', icon: <FaDollarSign className="h-5 w-5 text-yellow-500 dark:text-yellow-400" /> },
]

const referrals = [
  { org: 'Peak Dental Group', date: 'Mar 12, 2026', status: 'Active', reward: '$120', logo: '' },
  { org: 'BrightSmile Med Spa', date: 'Mar 09, 2026', status: 'Active', reward: '$120', logo: '' },
  { org: 'Oak Ridge Roofing', date: 'Feb 28, 2026', status: 'Pending', reward: '$60', logo: '' },
  { org: 'Sunshine Clinic', date: 'Feb 22, 2026', status: 'Active', reward: '$80', logo: '' },
  { org: 'Mountainview Med Spa', date: 'Feb 18, 2026', status: 'Pending', reward: '$40', logo: '' },
]

const leaderboard = [
  { name: 'Rahul Goswami', reward: '$320', avatar: '' },
  { name: 'Aisha Khan', reward: '$280', avatar: '' },
  { name: 'Marcus Lee', reward: '$200', avatar: '' },
]

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false)
  const [filter, setFilter] = useState<'All' | 'Last 7 Days' | 'This Month'>('All')

  const handleCopy = () => {
    navigator.clipboard.writeText('https://yourreferral.link/demo')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const filteredReferrals = referrals.filter((r) => {
    if (filter === 'All') return true
    if (filter === 'Last 7 Days') {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - 7)
      return new Date(r.date) >= daysAgo
    }
    if (filter === 'This Month') {
      const now = new Date()
      const d = new Date(r.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }
    return true
  })

  return (
    <section className="space-y-6">

      {/* Header */}
      <header className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-800/50 dark:bg-[#0d1220]/70 transition-all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Referrals</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Share your link, invite businesses, and track rewards</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="relative inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white
                         bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg
                         hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0
                         before:absolute before:inset-0 before:rounded-full before:bg-white/10 before:opacity-0 hover:before:opacity-20 before:transition-opacity"
            >
              {copied ? 'Copied!' : 'Copy Referral Link'}
            </button>
            <button className="rounded-full p-2 bg-gray-100/60 hover:bg-gray-200/70 dark:bg-gray-800/60 dark:hover:bg-gray-700/50 transition">
              <FaShareAlt className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        {referralStats.map((item) => (
          <article
            key={item.label}
            className="flex items-center gap-4 cursor-pointer rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition hover:shadow-xl dark:bg-[#11192d]/70"
          >
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Filter */}
      <div className="flex items-center justify-end gap-2">
        {['All', 'Last 7 Days', 'This Month'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Referral Activity Table */}
      <section className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-800/50 dark:bg-[#0d1220]/70 transition-all">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Referral Activity</h2>
        <div className="space-y-3">
          {filteredReferrals.map((item) => (
            <article
              key={item.org}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#11192d]"
            >
              {/* Org Info */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium">
                  {item.org
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.org}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                </div>
              </div>

              {/* Reward + Status + Actions */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.reward}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                    item.status === 'Active'
                      ? 'bg-green-100 text-green-700 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-500/30'
                      : 'bg-yellow-100 text-yellow-800 ring-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:ring-yellow-500/30'
                  }`}
                >
                  {item.status}
                </span>
                {item.status === 'Pending' && (
                  <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Resend Invite
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-800/50 dark:bg-[#0d1220]/70 transition-all">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Top Referrers</h2>
        <div className="flex flex-col gap-3">
          {leaderboard.map((user, idx) => (
            <div
              key={user.name}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#11192d]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.reward}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
