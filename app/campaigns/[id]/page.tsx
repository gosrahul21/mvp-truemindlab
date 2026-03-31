type CampaignDetailPageProps = {
  params: Promise<{ id: string }>
}

const steps = [
  { order: 1, title: 'Instant acknowledgment SMS', delay: '0 min', channel: 'SMS' },
  { order: 2, title: 'Offer reminder message', delay: '2 hours', channel: 'SMS' },
  { order: 3, title: 'Value email with booking CTA', delay: '24 hours', channel: 'Email' },
  { order: 4, title: 'Final follow-up nudge', delay: '48 hours', channel: 'SMS' },
]

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params
  const campaignName = id
    .split('-')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Campaign Detail</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{campaignName}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Edit sequence flow, channel settings, and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#11192d]">
              Pause Campaign
            </button>
            <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Sent</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">324</p>
        </article>
        <article className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Open / Reply Rate</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">42.3%</p>
        </article>
        <article className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Booked Appointments</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">46</p>
        </article>
      </section>

      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Sequence Steps</h2>
        <ul className="space-y-3">
          {steps.map((step) => (
            <li key={step.order} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#11192d]">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Step {step.order}: {step.title}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Delay: {step.delay} · Channel: {step.channel}
                </p>
              </div>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">Edit</button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
