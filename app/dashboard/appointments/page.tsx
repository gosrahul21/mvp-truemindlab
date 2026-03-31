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
  {
    id: 1,
    leadName: 'Sarah Smith',
    channel: 'Website',
    date: 'Mar 31, 2026',
    time: '2:30 PM',
    owner: 'Rahul',
    status: 'Confirmed',
  },
  {
    id: 2,
    leadName: 'Michael Tran',
    channel: 'SMS',
    date: 'Mar 31, 2026',
    time: '4:00 PM',
    owner: 'Aisha',
    status: 'Pending',
  },
  {
    id: 3,
    leadName: 'John Doe',
    channel: 'Voice',
    date: 'Apr 01, 2026',
    time: '10:00 AM',
    owner: 'Rahul',
    status: 'Completed',
  },
  {
    id: 4,
    leadName: 'Priya Sharma',
    channel: 'Email',
    date: 'Apr 01, 2026',
    time: '11:30 AM',
    owner: 'Marcus',
    status: 'No Show',
  },
  {
    id: 5,
    leadName: 'Alex Rivera',
    channel: 'SMS',
    date: 'Apr 02, 2026',
    time: '9:15 AM',
    owner: 'Aisha',
    status: 'Confirmed',
  },
]

function statusClass(status: AppointmentStatus) {
  if (status === 'Confirmed')
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  if (status === 'Completed')
    return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30'
  if (status === 'Pending')
    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  return 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30'
}

export default function AppointmentsPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-400">
              Appointments
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Monitor bookings, confirmations, and no-shows in one place
            </p>
          </div>

          <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
            New Appointment
          </button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Today&apos;s Bookings</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">8</p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+14% vs yesterday</p>
        </article>
        <article className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
          <p className="text-sm text-gray-500 dark:text-gray-400">No Show Rate</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">11%</p>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Needs follow-up automation</p>
        </article>
        <article className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Confirmed Rate</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">79%</p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Healthy booking quality</p>
        </article>
      </section>

      <article className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#0d1220] sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming & Recent</h2>
          <button className="text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
            View calendar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Lead</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Channel</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Time</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Owner</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer rounded-xl bg-gray-50 transition hover:bg-gray-100 dark:bg-[#11192d] dark:hover:bg-[#14203a]"
                >
                  <td className="rounded-l-xl px-3 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{item.leadName}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{item.channel}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{item.date}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{item.time}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{item.owner}</td>
                  <td className="rounded-r-xl px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
