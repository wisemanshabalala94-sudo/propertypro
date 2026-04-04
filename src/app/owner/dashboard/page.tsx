import { DashboardCard } from "@/components/dashboard-card";

const approvalQueue = [
  { title: "Caretaker payout", amount: "R3,200", status: "Pending owner approval" },
  { title: "Plumbing emergency", amount: "R5,950", status: "Second approval required" }
];

const financeFlow = [
  "Tenant pays through Paystack or deposits with the correct reference.",
  "Webhook or bank import updates the invoice and creates a receipt trail.",
  "R100 per tenant payment is reserved into the Wiseworx savings allocation.",
  "Only approved owner disbursement requests can move income out to payout accounts."
];

const teamMembers = [
  { name: "Musa Ndlovu", role: "Building manager", scope: "Collections, tenants, maintenance", status: "Active" },
  { name: "Rethabile Mokoena", role: "Finance officer", scope: "Reconciliation, receipts, reporting", status: "Active" },
  { name: "Lerato Dube", role: "Support lead", scope: "Tenant support only", status: "Restricted" }
];

export default function OwnerDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="glass-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Owner dashboard</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
          Control collections, spending, and team access with confidence.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-fog">
          Owners see live collection performance, outstanding arrears, and any payout or operating debit that needs approval
          before the funds leave the business account.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <DashboardCard title="Collected this month" value="R214,500" detail="Confirmed receipts across all active leases." tone="dark" />
          <DashboardCard title="Outstanding" value="R34,700" detail="Unpaid and partially paid invoices." tone="dark" />
          <DashboardCard title="Reserved savings" value="R2,100" detail="Wiseworx administration reserve tracked separately." tone="dark" />
          <DashboardCard title="Pending approvals" value="2" detail="No disbursement should happen before sign-off." tone="dark" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Approval queue</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Requests waiting on ownership</h2>
          <div className="mt-6 space-y-4">
            {approvalQueue.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">{item.title}</p>
                    <p className="text-sm text-fog">{item.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink">{item.amount}</span>
                    <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">
                      Review
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="glass-panel gradient-stroke rounded-[2.4rem] p-8 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">AI insight</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">Cash position narrative</h2>
          <p className="mt-4 text-sm leading-7 text-fog">
            AI can explain why cash available differs from cash collected by separating reserved savings, unmatched deposits,
            pending approvals, and expected debit runs.
          </p>
          <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent.cyan">Money flow</p>
            <ul className="mt-3 space-y-3 text-sm leading-7 text-fog">
              {financeFlow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Team access</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Who can help run the building</h2>
            </div>
            <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Invite member</button>
          </div>
          <div className="mt-6 space-y-4">
            {teamMembers.map((member) => (
              <article key={member.name} className="rounded-[1.6rem] border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">{member.name}</p>
                    <p className="text-sm text-fog">{member.role}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{member.scope}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark">
                      {member.status}
                    </span>
                    <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-800">
                      Edit access
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-8 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Access logic</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">
            Owners decide who can see, change, approve, or release funds.
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-fog">
            <p>Building managers can oversee tenants and operations without touching final owner-level payouts.</p>
            <p>Finance staff can reconcile deposits, review receipts, and prepare reports with limited outbound authority.</p>
            <p>Every action can be constrained by role, building, or approval threshold.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
