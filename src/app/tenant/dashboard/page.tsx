import { DashboardCard } from "@/components/dashboard-card";

const invoices = [
  { month: "April 2026", amount: "R7,500", status: "Due 5 Apr", reference: "PPR-AB12-CD34" },
  { month: "March 2026", amount: "R7,500", status: "Paid", reference: "PPR-AB12-XY89" }
];

const onboardingTasks = [
  "Upload 3 months of bank statements",
  "Approve debit mandate or choose manual payment",
  "Confirm emergency contact and move-in details"
];

const activityTimeline = [
  { label: "Rent due signal issued", time: "Today 08:15", tone: "Scheduled" },
  { label: "AI checked statement completeness", time: "Today 09:00", tone: "Verified" },
  { label: "Debit mandate waiting confirmation", time: "Today 09:12", tone: "Action needed" }
];

const paymentMethods = [
  {
    title: "Card or Paystack checkout",
    detail: "Fastest option for instant confirmation and receipts."
  },
  {
    title: "Bank deposit",
    detail: "This tenant gets a unique reference that should never be reused by another tenant."
  },
  {
    title: "Debit order",
    detail: "Once approved, the system can collect automatically on the agreed date."
  }
];

export default function TenantDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="glass-panel gradient-stroke overflow-hidden rounded-[2.4rem] p-8 md:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Tenant dashboard</p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
            Rent made effortless, visible, and premium.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-fog">
            Tenants get a simple mobile-first flow: see what is due, pay quickly, upload required onboarding documents,
            and keep the right bank-deposit reference visible at all times.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <DashboardCard title="Outstanding balance" value="R7,500" detail="One invoice is currently due." tone="dark" />
            <DashboardCard title="Preferred method" value="Paystack" detail="Card, bank transfer, or EFT supported." tone="dark" />
            <DashboardCard title="Savings reserve" value="R100" detail="Reserved from each settled tenant payment." tone="dark" />
          </div>
        </div>

        <aside className="glass-panel gradient-stroke rounded-[2.4rem] p-8 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Onboarding progress</p>
          <ul className="mt-5 space-y-3">
            {onboardingTasks.map((task) => (
              <li key={task} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7">
                {task}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-3xl bg-white p-4 text-slate-900">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fog">AI helper</p>
            <p className="mt-2 text-sm leading-7">
              AI checks whether uploaded statements are readable, complete, and likely to satisfy affordability review.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fog">Invoices</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Rent history</h2>
            </div>
            <button className="rounded-full bg-panel px-5 py-3 text-sm font-semibold text-white shadow-panel">Pay now</button>
          </div>
          <div className="mt-6 space-y-4">
            {invoices.map((invoice) => (
              <article key={invoice.reference} className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">{invoice.month}</p>
                    <p className="mt-1 font-mono text-sm text-fog">Reference: {invoice.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-ink">{invoice.amount}</p>
                    <p className="text-sm text-fog">{invoice.status}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 text-white md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">Payment details</p>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Use this reference every time</h2>
            <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-accent.cyan">Unique reference</p>
              <p className="mt-3 font-display text-3xl font-semibold">PPR-AB12-CD34</p>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-7 text-fog">
              <p>Card payments can open Paystack checkout.</p>
              <p>ATM deposits and bank transfers must include the exact reference assigned to this tenant so the system can reconcile them faster.</p>
              <p>If the reference is missing, the admin queue will hold the payment until it is reviewed manually.</p>
            </div>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fog">Live activity</p>
            <div className="mt-5 space-y-4">
              {activityTimeline.map((item) => (
                <article key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{item.label}</p>
                      <p className="mt-1 text-sm text-fog">{item.time}</p>
                    </div>
                    <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark">
                      {item.tone}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fog">Payment options</p>
            <div className="mt-5 space-y-4">
              {paymentMethods.map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-7 text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
