export default function BookingSettingsPage() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-purple-500">
          Booking Settings
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-300">
          Set your booking URL, confirmations, reminders, and no-show flow.
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-4">
        <article className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl shadow-lg shadow-black/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Booking URL
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-300">
            https://book.closeflow.ai/demo-business
          </p>
        </article>

        <article className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl shadow-lg shadow-black/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Reminder Rules
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-300">
            24h reminder + 1h reminder enabled
          </p>
        </article>
      </div>
    </section>
  )
}
