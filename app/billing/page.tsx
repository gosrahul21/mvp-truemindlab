type Plan = {
  name: string;
  price: string;
  sms: string;
  email: string;
  voice: string;
  current?: boolean;
};

const plans: Plan[] = [
  { name: 'Starter', price: '$197/mo', sms: '1,000 SMS', email: '5,000 emails', voice: '200 voice mins' },
  { name: 'Pro', price: '$597/mo', sms: '6,000 SMS', email: '20,000 emails', voice: '1,000 voice mins', current: true },
  { name: 'Agency', price: '$997/mo', sms: '12,000 SMS', email: '50,000 emails', voice: '2,500 voice mins' },
];

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  const isCurrent = plan.current;

  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isCurrent
          ? 'border-slate-900 bg-slate-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
          : 'border-gray-200/80 bg-white dark:border-gray-800 dark:bg-[#0d1220]'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-lg font-semibold ${!isCurrent ? 'text-gray-900 dark:text-gray-100' : ''}`}>
          {plan.name}
        </h2>
        {isCurrent && (
          <span
            aria-current="true"
            className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium dark:bg-gray-900/10"
          >
            Current <span className="sr-only">Plan</span>
          </span>
        )}
      </div>

      <p className={`text-3xl font-bold tracking-tight ${!isCurrent ? 'text-gray-900 dark:text-gray-100' : ''}`}>
        {plan.price}
      </p>

      <ul
        className={`mt-6 flex-1 space-y-3 text-sm ${
          isCurrent ? 'text-white/80 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'
        }`}
      >
        <li className="flex items-center gap-2.5">
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span>{plan.sms}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span>{plan.email}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span>{plan.voice}</span>
        </li>
      </ul>

      <div className="mt-8">
        {isCurrent ? (
          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/60 cursor-not-allowed dark:bg-gray-900/10 dark:text-gray-900/60"
          >
            Current Plan
          </button>
        ) : (
          <button
            type="button"
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
          >
            Change to {plan.name}
          </button>
        )}
      </div>
    </article>
  );
}

export default function BillingPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Billing</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage subscription, payment method, and invoices
            </p>
          </div>
          <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
            Manage Subscription
          </button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </section>
    </section>
  );
}
