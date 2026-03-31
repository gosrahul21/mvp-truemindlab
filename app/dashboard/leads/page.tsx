type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Booked'

type Lead = {
  id: number
  name: string
  source: string
  stage: LeadStatus
  lastActivity: string
  value: string
}

const leads: Lead[] = [
  { id: 1, name: 'Sarah Smith', source: 'Facebook Ads', stage: 'Qualified', lastActivity: '5m ago', value: '$1,200' },
  { id: 2, name: 'John Doe', source: 'Website Form', stage: 'Contacted', lastActivity: '18m ago', value: '$900' },
  { id: 3, name: 'Michael Tran', source: 'Google Ads', stage: 'Booked', lastActivity: '42m ago', value: '$1,800' },
  { id: 4, name: 'Alex Rivera', source: 'Referral', stage: 'New', lastActivity: '1h ago', value: '$750' },
  { id: 5, name: 'Priya Sharma', source: 'Landing Page', stage: 'Contacted', lastActivity: '2h ago', value: '$1,050' },
]

function stageClass(stage: LeadStatus) {
  if (stage === 'Booked') return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  if (stage === 'Qualified') return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30'
  if (stage === 'Contacted') return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:ring-gray-500/30'
}

export default function LeadsPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-400">
              Leads
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Track and manage every lead in your pipeline</p>
          </div>

          <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
            Add Lead
          </button>
        </div>
      </header>

      <article className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#0d1220] sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Leads</h2>
          <button className="text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Source</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Stage</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Last Activity</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Value</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="cursor-pointer rounded-xl bg-gray-50 transition hover:bg-gray-100 dark:bg-[#11192d] dark:hover:bg-[#14203a]"
                >
                  <td className="rounded-l-xl px-3 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{lead.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{lead.source}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${stageClass(lead.stage)}`}>{lead.stage}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{lead.lastActivity}</td>
                  <td className="rounded-r-xl px-3 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{lead.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
