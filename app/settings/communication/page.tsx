export default function CommunicationSettingsPage() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Communication Settings</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Configure global SMS/email sending behavior and compliance rules.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Business Hours Sending</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Send messages only between 9:00 AM and 7:00 PM</p>
        </label>
        <label className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Auto Opt-Out Handling</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Stop outbound communication on opt-out replies</p>
        </label>
      </div>
    </section>
  )
}
