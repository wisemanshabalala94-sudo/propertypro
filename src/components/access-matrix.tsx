const roles = [
  {
    role: "Owner",
    access: "Approvals, payouts, team permissions, building-wide finance visibility"
  },
  {
    role: "Building manager",
    access: "Collections, tenant onboarding, maintenance oversight, no owner-level payouts"
  },
  {
    role: "Finance officer",
    access: "Reconciliation, receipts, invoice oversight, limited outbound finance actions"
  },
  {
    role: "Administrator",
    access: "Unlimited platform control, role assignment, overrides, audit supervision"
  }
];

export function AccessMatrix() {
  return (
    <div className="light-panel gradient-stroke rounded-[2.2rem] p-6 md:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Role access</p>
      <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Who can do what</h2>
      <div className="mt-6 space-y-4">
        {roles.map((item) => (
          <article key={item.role} className="rounded-[1.6rem] border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <p className="font-display text-xl font-semibold text-ink">{item.role}</p>
              <p className="max-w-xl text-sm leading-7 text-slate-600">{item.access}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
