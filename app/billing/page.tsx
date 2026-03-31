type PlanCard = {
  name: string
  price: string
  sms: string
  email: string
  voice: string
  current?: boolean
}

const plans: PlanCard[] = [
  { name: 'Starter', price: '$197/mo', sms: '1,000 SMS', email: '5,000 emails', voice: '200 voice mins' },
  { name: 'Pro', price: '$597/mo', sms: '6,000 SMS', email: '20,000 emails', voice: '1,000 voice mins', current: true },
  { name: 'Agency', price: '$997/mo', sms: '12,000 SMS', email: '50,000 emails', voice: '2,500 voice mins' },
]

export default function BillingPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Billing</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage subscription, payment method, and invoices</p>
            </div>
            <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
              Manage Subscription
            </button>
          </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`cursor-pointer rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              plan.current
                ? 'border-slate-900 bg-slate-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                : 'border-gray-200/80 bg-white dark:border-gray-800 dark:bg-[#0d1220]'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${plan.current ? '' : 'text-gray-900 dark:text-gray-100'}`}>{plan.name}</h2>
              {plan.current && <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium dark:bg-gray-900/10">Current</span>}
            </div>
            <p className={`text-2xl font-semibold ${plan.current ? '' : 'text-gray-900 dark:text-gray-100'}`}>{plan.price}</p>
            <ul className={`mt-4 space-y-2 text-sm ${plan.current ? 'text-white/80 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}`}>
              <li>{plan.sms}</li>
              <li>{plan.email}</li>
              <li>{plan.voice}</li>
            </ul>
          </article>
        ))}
      </section>
    </section>
  )
}
