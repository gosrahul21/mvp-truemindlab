'use client'

type ChangeTone = 'positive' | 'negative' | 'neutral'
type ActivityStatus = 'Delivered' | 'Failed' | 'Pending'

type Stat = {
  title: string
  value: string
  change: string
  changeTone: ChangeTone
  description: string
  progress?: number
}

type Activity = {
  id: number
  type: 'sms' | 'email' | 'call' | 'lead'
  title: string
  timeAgo: string
  status: ActivityStatus
}

type PipelineStage = {
  stage: string
  count: number
  progress: number
}

type UsageMetric = {
  label: string
  used: number
  limit: number
}

const stats: Stat[] = [
  { title: 'Leads', value: '124', change: '+12%', changeTone: 'positive', description: 'New leads this week' },
  { title: 'Bookings', value: '38', change: '+8%', changeTone: 'positive', description: 'Appointments scheduled' },
  { title: 'Conversion Rate', value: '30.6%', change: '+2.1%', changeTone: 'positive', description: 'Lead to booking' },
  { title: 'Usage', value: '68%', change: '—', changeTone: 'neutral', description: 'Plan usage this month', progress: 68 },
]

const recentActivity: Activity[] = [
  { id: 1, type: 'lead', title: 'New lead added: Sarah Smith', timeAgo: '2m ago', status: 'Delivered' },
  { id: 2, type: 'sms', title: 'SMS sent to John Doe', timeAgo: '10m ago', status: 'Delivered' },
  { id: 3, type: 'email', title: 'Email opened by Michael', timeAgo: '24m ago', status: 'Pending' },
]

const pipelineStages: PipelineStage[] = [
  { stage: 'New', count: 24, progress: 100 },
  { stage: 'Contacted', count: 18, progress: 75 },
  { stage: 'Qualified', count: 12, progress: 50 },
  { stage: 'Booked', count: 8, progress: 33 },
]

const usageOverview: UsageMetric[] = [
  { label: 'SMS Usage', used: 450, limit: 1000 },
  { label: 'Email Usage', used: 1200, limit: 5000 },
  { label: 'Voice Minutes', used: 90, limit: 200 },
]

export default function DashboardPage() {
  return (
    <section className="space-y-6">

      {/* HEADER */}
      <header className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl p-6 dark:border-gray-800/60 dark:bg-[#0d1220]/80">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Overview of your leads and performance
            </p>
          </div>

          <button className="rounded-xl px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900">
            + Create Lead
          </button>
        </div>
      </header>

      {/* QUICK ACTIONS */}
      <section className="grid gap-4 sm:grid-cols-3">
        {['New Lead', 'Send Campaign', 'Book Appointment'].map((item) => (
          <button
            key={item}
            className="text-left rounded-2xl p-5 bg-white/80 dark:bg-[#0d1220]/80 border border-gray-200/60 dark:border-gray-800/60 hover:shadow-md transition"
          >
            <p className="text-sm font-semibold">{item}</p>
            <p className="text-xs text-gray-500 mt-1">Quick action</p>
          </button>
        ))}
      </section>

      {/* STATS */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.title}
            className="rounded-2xl p-6 bg-white/80 dark:bg-[#0f1525]/80 border border-gray-200/60 dark:border-gray-800/60 hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <span className="text-xs text-gray-400">{stat.change}</span>
            </div>

            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.description}</p>

            {stat.progress && (
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <div
                  className="h-2 bg-indigo-500 rounded-full"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
          </article>
        ))}
      </section>

      {/* MAIN GRID */}
      <section className="grid gap-6 xl:grid-cols-10">

        {/* ACTIVITY */}
        <div className="xl:col-span-7 rounded-2xl p-6 bg-white/80 dark:bg-[#0d1220]/80 border border-gray-200/60 dark:border-gray-800/60">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#11192d]"
              >
                <div className="h-9 w-9 flex items-center justify-center bg-gray-100 dark:bg-[#1a2035] rounded-lg text-xs font-semibold">
                  {item.type.toUpperCase()}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.timeAgo}</p>
                </div>

                <span className="text-xs text-gray-500">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PIPELINE */}
        <div className="xl:col-span-3 rounded-2xl p-6 bg-white/80 dark:bg-[#0d1220]/80 border border-gray-200/60 dark:border-gray-800/60">
          <h2 className="text-lg font-semibold mb-4">Pipeline</h2>

          <div className="space-y-4">
            {pipelineStages.map((item) => (
              <div key={item.stage}>
                <div className="flex justify-between text-sm">
                  <span>{item.stage}</span>
                  <span>{item.count}</span>
                </div>

                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-1">
                  <div
                    className="h-2 bg-indigo-500 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {item.progress}% conversion
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USAGE */}
      <section className="rounded-2xl p-6 bg-white/80 dark:bg-[#0d1220]/80 border border-gray-200/60 dark:border-gray-800/60">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Usage</h2>

          <button className="text-sm text-gray-500 hover:text-gray-900">
            Upgrade
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {usageOverview.map((item) => {
            const percentage = (item.used / item.limit) * 100

            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.used}/{item.limit}</span>
                </div>

                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-1">
                  <div
                    className={`h-2 rounded-full ${
                      percentage > 80 ? 'bg-red-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {percentage > 80 ? 'Limit near' : 'Healthy usage'}
                </p>
              </div>
            )
          })}
        </div>
      </section>

    </section>
  )
}
