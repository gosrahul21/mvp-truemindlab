export default function VoiceSettingsPage() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Voice Settings</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage voice preset, call behavior, and voice usage controls.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Selected Voice</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Professional Female</p>
        </article>
        <article className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Monthly Minutes</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">90 / 200 used</p>
        </article>
        <article className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Call Window</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Mon-Sat · 9:00 AM to 6:00 PM</p>
        </article>
      </div>
    </section>
  )
}
