type CampaignStatus = 'Active' | 'Draft' | 'Paused'

type Campaign = {
  id: string
  name: string
  channel: 'SMS + Email' | 'SMS' | 'Email'
  trigger: string
  sent: number
  booked: number
  status: CampaignStatus
}

const campaigns: Campaign[] = [
  { id: 'welcome-sequence', name: 'New Lead Welcome Sequence', channel: 'SMS + Email', trigger: 'New lead', sent: 324, booked: 46, status: 'Active' },
  { id: 'no-reply-nudge', name: 'No Reply Nudge', channel: 'SMS', trigger: 'No reply in 3h', sent: 219, booked: 28, status: 'Active' },
  { id: 'reactivation-q2', name: 'Q2 Reactivation', channel: 'Email', trigger: 'Manual', sent: 740, booked: 33, status: 'Paused' },
  { id: 'post-missed-followup', name: 'Post Missed Appointment', channel: 'SMS + Email', trigger: 'Missed appointment', sent: 88, booked: 9, status: 'Draft' },
]

function statusClass(status: CampaignStatus) {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  if (status === 'Paused') return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:ring-gray-500/30'
}

export default function CampaignsPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Campaigns</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage automations, triggers, and campaign performance</p>
          </div>
          <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
            Create Campaign
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Campaigns</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{campaigns.length} total</span>
        </div>

        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <a
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="flex cursor-pointer flex-col gap-3 rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#11192d] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{campaign.name}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {campaign.channel} · Trigger: {campaign.trigger}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{campaign.sent}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{campaign.booked}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Booked</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(campaign.status)}`}>{campaign.status}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </section>
  )
}
