type PlanCard = {
  name: string
  price: string
  seats: string
  sms: string
  email: string
  voice: string
  active?: boolean
}

type Invoice = {
  id: string
  date: string
  amount: string
  status: 'Paid' | 'Pending'
}

const plans: PlanCard[] = [
  { name: 'Starter', price: '$197/mo', seats: 'Up to 2 users', sms: '1,000 SMS', email: '5,000 emails', voice: '200 mins' },
  { name: 'Pro', price: '$597/mo', seats: 'Up to 10 users', sms: '6,000 SMS', email: '20,000 emails', voice: '1,000 mins', active: true },
  { name: 'Agency', price: '$997/mo', seats: 'Unlimited users', sms: '12,000 SMS', email: '50,000 emails', voice: '2,500 mins' },
]

const invoices: Invoice[] = [
  { id: 'INV-2403', date: 'Mar 01, 2026', amount: '$597.00', status: 'Paid' },
  { id: 'INV-2402', date: 'Feb 01, 2026', amount: '$597.00', status: 'Paid' },
  { id: 'INV-2401', date: 'Jan 01, 2026', amount: '$597.00', status: 'Pending' },
]

export default function BillingPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-400">
              Billing
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your plan, invoices, and payment settings</p>
          </div>

          <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
            Manage Subscription
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`cursor-pointer rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              plan.active
                ? 'border-slate-900 bg-slate-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                : 'border-gray-200/80 bg-white dark:border-gray-800 dark:bg-[#0d1220]'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${plan.active ? '' : 'text-gray-900 dark:text-gray-100'}`}>{plan.name}</h2>
              {plan.active && (
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium ring-1 ring-white/25 dark:bg-gray-900/10 dark:ring-gray-900/20">
                  Current
                </span>
              )}
            </div>
            <p className={`text-2xl font-semibold tracking-tight ${plan.active ? '' : 'text-gray-900 dark:text-gray-100'}`}>{plan.price}</p>
            <ul className={`mt-4 space-y-2 text-sm ${plan.active ? 'text-white/80 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}`}>
              <li>{plan.seats}</li>
              <li>{plan.sms}</li>
              <li>{plan.email}</li>
              <li>{plan.voice}</li>
            </ul>
          </article>
        ))}
      </section>

      <article className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Invoices</h2>
          <button className="text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
            Download all
          </button>
        </div>

        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#11192d]"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{invoice.id}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.date}</p>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{invoice.amount}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    invoice.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
                      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
