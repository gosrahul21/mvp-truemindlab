'use client'

import { useState } from 'react'

type AppointmentStatus = 'Confirmed' | 'Pending' | 'No Show' | 'Completed'

type Appointment = {
  id: number
  leadName: string
  channel: 'Website' | 'SMS' | 'Voice' | 'Email'
  date: string
  time: string
  owner: string
  status: AppointmentStatus
}

const appointments: Appointment[] = [
  { id: 1, leadName: 'Sarah Smith', channel: 'Website', date: 'Mar 31, 2026', time: '2:30 PM', owner: 'Rahul', status: 'Confirmed' },
  { id: 2, leadName: 'Michael Tran', channel: 'SMS', date: 'Mar 31, 2026', time: '4:00 PM', owner: 'Aisha', status: 'Pending' },
  { id: 3, leadName: 'John Doe', channel: 'Voice', date: 'Apr 01, 2026', time: '10:00 AM', owner: 'Rahul', status: 'Completed' },
  { id: 4, leadName: 'Priya Sharma', channel: 'Email', date: 'Apr 01, 2026', time: '11:30 AM', owner: 'Marcus', status: 'No Show' },
]

function statusClass(status: AppointmentStatus) {
  if (status === 'Confirmed') return 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
  if (status === 'Completed') return 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
  if (status === 'Pending') return 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20'
  return 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
}

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<'All' | AppointmentStatus>('All')

  const filtered =
    filter === 'All' ? appointments : appointments.filter((a) => a.status === filter)

  return (
    <section className="space-y-6">

      {/* HEADER */}
      <header className="rounded-3xl border border-gray-200/50 bg-white/80 p-6 backdrop-blur-xl shadow-lg dark:border-gray-800/50 dark:bg-[#0d1220]/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Appointments
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor bookings, confirmations, and no-shows
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">

            {/* Filter */}
            <select
              onChange={(e) => setFilter(e.target.value as any)}
              className="rounded-xl border border-gray-300 bg-white/70 px-3 py-2 text-sm backdrop-blur dark:border-gray-700 dark:bg-[#0f1525]/70"
            >
              <option>All</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>No Show</option>
            </select>

            {/* CTA - subtle premium */}
            <button className="rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm font-medium text-gray-800 backdrop-blur transition hover:bg-white dark:border-gray-700 dark:bg-[#11192d]/70 dark:text-gray-200">
              + New
            </button>
          </div>
        </div>
      </header>

      {/* LIST */}
      <section className="rounded-3xl border border-gray-200/50 bg-white/80 p-6 backdrop-blur-xl shadow-lg dark:border-gray-800/50 dark:bg-[#0d1220]/70">
        
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Upcoming & Recent
          </h2>
          <button className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            Calendar view →
          </button>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/70 px-5 py-4 transition hover:bg-gray-50 hover:shadow-md dark:border-gray-800/60 dark:bg-[#11192d]/70 dark:hover:bg-[#1a2035]"
            >

              <div className="flex items-center justify-between">

                {/* LEFT */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.leadName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {item.channel} · {item.date} · {item.time}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                  <p className="text-xs text-gray-500">{item.owner}</p>

                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* ACTIONS (on hover) */}
              <div className="hidden gap-2 pt-2 group-hover:flex">
                <button className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-[#1a2035]">
                  Confirm
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-[#1a2035]">
                  Reschedule
                </button>
                <button className="rounded-lg border border-red-400/40 px-3 py-1 text-xs text-red-500 hover:bg-red-500/10">
                  Mark No-show
                </button>
              </div>

            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
