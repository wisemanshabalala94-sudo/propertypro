import { DashboardCard } from "@/components/dashboard-card";

const unmatchedTransactions = [
  { source: "ATM deposit", amount: "R7,500", detail: "No usable reference supplied" },
  { source: "Card debit reversal", amount: "R1,250", detail: "Needs tenant follow-up" },
  { source: "Bank transfer", amount: "R7,500", detail: "Possible fuzzy match to Unit A12" }
];

export default function AdminOverviewPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Admin overview</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Run collections, reconciliation, and onboarding from one place.</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          This view is built for the operations team: import bank activity, monitor auto-capture confidence, support tenant onboarding,
          and keep owner approvals moving without losing auditability.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <DashboardCard title="Active tenants" value="128" detail="Across 5 properties and 142 units." />
          <DashboardCard title="Open onboarding cases" value="19" detail="Mostly waiting on statement uploads." />
          <DashboardCard title="Unmatched cash items" value="3" detail="Requires manual review today." />
          <DashboardCard title="Auto-match rate" value="91%" detail="Reference-led matching is working well." />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reconciliation queue</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Unmatched and exception items</h2>
          <div className="mt-6 space-y-4">
            {unmatchedTransactions.map((item) => (
              <article key={item.source + item.amount} className="rounded-3xl border border-slate-200 bg-sand p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-ink">{item.source}</p>
                    <p className="text-sm text-slate-600">{item.detail}</p>
                  </div>
                  <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Resolve</button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-ink p-8 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft">AI operations layer</p>
          <div className="mt-4 grid gap-4">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Document triage</h3>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Rank tenant submissions by missing statement months, unreadable scans, and debit mandate gaps.
              </p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Collections assistant</h3>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Draft reminder messages and suggest the right action for card failures, partial payments, and arrears.
              </p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Finance anomaly watch</h3>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Flag suspicious debit requests, duplicate bank imports, and unusual drops in monthly collections.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
