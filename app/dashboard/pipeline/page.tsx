type PipelineStage = {
  name: string
  leads: number
  conversion: string
  progress: number
}

const stages: PipelineStage[] = [
  { name: 'New', leads: 24, conversion: '100%', progress: 100 },
  { name: 'Contacted', leads: 18, conversion: '75%', progress: 75 },
  { name: 'Qualified', leads: 12, conversion: '50%', progress: 50 },
  { name: 'Booked', leads: 8, conversion: '33%', progress: 33 },
  { name: 'Closed Won', leads: 5, conversion: '21%', progress: 21 },
  { name: 'Closed Lost', leads: 3, conversion: '13%', progress: 13 },
]

export default function PipelinePage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-400">
              Pipeline
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Track lead movement and conversion by stage</p>
          </div>

          <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
            Update Stages
          </button>
        </div>
      </header>

      <article className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pipeline Overview</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
        </div>

        <ul className="space-y-3">
          {stages.map((stage) => (
            <li
              key={stage.name}
              className="cursor-pointer rounded-xl border border-gray-100 p-4 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#11192d]"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage.name}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{stage.conversion}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stage.leads}</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-600 transition-all duration-300 dark:from-slate-300 dark:to-slate-500"
                  style={{ width: `${stage.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
