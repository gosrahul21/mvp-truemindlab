export default function EmailSettingsPage() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Settings</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Configure provider connection, sender details, and domain preferences.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Provider</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">SMTP (platform-managed) · Connected</p>
        </article>
        <article className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">From Address</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">hello@closeflow.ai</p>
        </article>
      </div>
    </section>
  )
}
