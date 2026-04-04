import { DashboardCard } from "@/components/dashboard-card";

const approvalQueue = [
  { title: "Caretaker payout", amount: "R3,200", status: "Pending owner approval" },
  { title: "Plumbing emergency", amount: "R5,950", status: "Second approval required" }
];

export default function OwnerDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Owner dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Protect rental income before any money is used.</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          Owners see live collection performance, outstanding arrears, and any payout or operating debit that needs approval
          before the funds leave the business account.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <DashboardCard title="Collected this month" value="R214,500" detail="Confirmed receipts across all active leases." />
          <DashboardCard title="Outstanding" value="R34,700" detail="Unpaid and partially paid invoices." />
          <DashboardCard title="Reserved savings" value="R2,100" detail="Wiseworx administration reserve tracked separately." />
          <DashboardCard title="Pending approvals" value="2" detail="No disbursement should happen before sign-off." />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Approval queue</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Requests waiting on ownership</h2>
          <div className="mt-6 space-y-4">
            {approvalQueue.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-sand p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-ink">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink">{item.amount}</span>
                    <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
                      Review
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] bg-ink p-8 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft">AI insight</p>
          <h2 className="mt-2 text-2xl font-semibold">Cash position narrative</h2>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            AI can explain why cash available differs from cash collected by separating reserved savings, unmatched deposits,
            pending approvals, and expected debit runs.
          </p>
        </aside>
      </section>
    </main>
  );
}

