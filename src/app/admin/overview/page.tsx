import { DashboardCard } from "@/components/dashboard-card";

const unmatchedTransactions = [
  { source: "ATM deposit", amount: "R7,500", detail: "No usable reference supplied" },
  { source: "Card debit reversal", amount: "R1,250", detail: "Needs tenant follow-up" },
  { source: "Bank transfer", amount: "R7,500", detail: "Possible fuzzy match to Unit A12" }
];

export default function AdminOverviewPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="glass-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Admin overview</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
          A control room for arrears, movement, and operational truth.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-fog">
          This view is built for the operations team: import bank activity, monitor auto-capture confidence, support tenant onboarding,
          and keep owner approvals moving without losing auditability.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <DashboardCard title="Active tenants" value="128" detail="Across 5 properties and 142 units." tone="dark" />
          <DashboardCard title="Open onboarding cases" value="19" detail="Mostly waiting on statement uploads." tone="dark" />
          <DashboardCard title="Unmatched cash items" value="3" detail="Requires manual review today." tone="dark" />
          <DashboardCard title="Auto-match rate" value="91%" detail="Reference-led matching is working well." tone="dark" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Reconciliation queue</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Unmatched and exception items</h2>
          <div className="mt-6 space-y-4">
            {unmatchedTransactions.map((item) => (
              <article key={item.source + item.amount} className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">{item.source}</p>
                    <p className="text-sm text-fog">{item.detail}</p>
                  </div>
                  <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Resolve</button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-8 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">AI operations layer</p>
          <div className="mt-4 grid gap-4">
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">Document triage</h3>
              <p className="mt-2 text-sm leading-7 text-fog">
                Rank tenant submissions by missing statement months, unreadable scans, and debit mandate gaps.
              </p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">Collections assistant</h3>
              <p className="mt-2 text-sm leading-7 text-fog">
                Draft reminder messages and suggest the right action for card failures, partial payments, and arrears.
              </p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">Finance anomaly watch</h3>
              <p className="mt-2 text-sm leading-7 text-fog">
                Flag suspicious debit requests, duplicate bank imports, and unusual drops in monthly collections.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
