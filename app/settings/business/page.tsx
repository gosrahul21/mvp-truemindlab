export default function BusinessSettingsPage() {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/20 backdrop-blur-md p-6 shadow-lg dark:border-gray-700/40 dark:bg-gray-800/30 dark:backdrop-blur-md">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Business Settings</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Update brand profile, location, and offer details used by AI automations.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          { label: 'Business Name', value: 'CloseFlow Demo Med Spa' },
          { label: 'Website URL', value: 'https://closeflow-demo.com' },
          { label: 'Primary Offer', value: 'Free consultation + first treatment discount' },
          { label: 'Location', value: 'San Francisco, CA' },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md shadow-sm transition hover:shadow-lg hover:scale-[1.02] dark:border-gray-700/40 dark:bg-gray-800/20"
          >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
