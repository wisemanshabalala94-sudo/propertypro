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

export default function TenantDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Tenant dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">A clear view of rent, references, and next steps.</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
            Tenants get a simple mobile-first flow: see what is due, pay quickly, upload required onboarding documents,
            and keep the right payment reference visible at all times.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <DashboardCard title="Outstanding balance" value="R7,500" detail="One invoice is currently due." />
            <DashboardCard title="Preferred method" value="Paystack" detail="Card, bank transfer, or EFT supported." />
            <DashboardCard title="Savings reserve" value="R100" detail="Reserved from each settled tenant payment." />
          </div>
        </div>

        <aside className="rounded-[2rem] bg-ink p-8 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft">Onboarding progress</p>
          <ul className="mt-5 space-y-3">
            {onboardingTasks.map((task) => (
              <li key={task} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7">
                {task}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-3xl bg-white p-4 text-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">AI helper</p>
            <p className="mt-2 text-sm leading-7">
              AI checks whether uploaded statements are readable, complete, and likely to satisfy affordability review.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Invoices</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Rent history</h2>
            </div>
            <button className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">Pay now</button>
          </div>
          <div className="mt-6 space-y-4">
            {invoices.map((invoice) => (
              <article key={invoice.reference} className="rounded-3xl border border-slate-200 bg-sand p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-ink">{invoice.month}</p>
                    <p className="text-sm text-slate-600">Reference: {invoice.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-ink">{invoice.amount}</p>
                    <p className="text-sm text-slate-600">{invoice.status}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Payment details</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Use this reference every time</h2>
          <div className="mt-5 rounded-3xl bg-ink p-6 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-soft">Unique reference</p>
            <p className="mt-3 text-3xl font-semibold">PPR-AB12-CD34</p>
          </div>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
            <p>Card payments can open Paystack checkout.</p>
            <p>ATM deposits and bank transfers must include the exact reference so the system can reconcile them faster.</p>
            <p>If the reference is missing, the admin queue will hold the payment until it is reviewed manually.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

