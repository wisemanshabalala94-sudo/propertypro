"use client";

import { useState } from "react";

const approvalQueue = [
  { title: "Caretaker payout", amount: "R3,200", reason: "Monthly site operations", state: "Needs approval", source: "Income account" },
  { title: "Plumbing emergency", amount: "R5,950", reason: "Burst pipe in Block C", state: "Urgent", source: "Reserve account" }
];

const team = [
  {
    name: "Musa Ndlovu",
    role: "Building manager",
    focus: "Tenant ops and daily maintenance",
    toggles: { tenants: true, collections: true, payouts: false, access: false }
  },
  {
    name: "Rethabile Mokoena",
    role: "Finance officer",
    focus: "Collections, reconciliation, and owner reporting",
    toggles: { tenants: false, collections: true, payouts: false, access: false }
  },
  {
    name: "Lerato Dube",
    role: "Support lead",
    focus: "Resident communication and issue follow-up",
    toggles: { tenants: true, collections: false, payouts: false, access: false }
  }
];

const portfolio = [
  { name: "Central Heights", units: 18, occupancy: "94%", collected: "R126,000", outstanding: "R14,000", maintenance: "3 open" },
  { name: "Palm Court", units: 12, occupancy: "100%", collected: "R88,500", outstanding: "R8,700", maintenance: "1 open" }
];

const reports = [
  { title: "Collections integrity", value: "92%", detail: "Paid or scheduled before grace-period breach." },
  { title: "Occupancy health", value: "97%", detail: "Occupied units across the active owner portfolio." },
  { title: "Maintenance closure", value: "81%", detail: "Requests resolved inside SLA this month." }
];

const cashLanes = [
  { label: "Gross rent in", amount: "R214,500", width: "w-full" },
  { label: "Reserved for Wiseworx savings", amount: "R20,000", width: "w-10/12" },
  { label: "Approved owner release", amount: "R186,300", width: "w-9/12" }
];

export function OwnerWorkspace() {
  const [selectedMember, setSelectedMember] = useState(team[0].name);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Owner workspace</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                See the whole portfolio, control cash movement, and delegate without losing power.
              </h2>
              <p className="mt-3 text-sm leading-7 text-fog">
                Owners need one live operating picture: collections, reserves, pending approvals, maintenance pressure,
                and which team members can touch which part of the building business.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white">
                Add payout account
              </button>
              <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Invite team member</button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Collected</p><p className="font-display mt-3 text-4xl text-white">R214,500</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Outstanding</p><p className="font-display mt-3 text-4xl text-white">R34,700</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Pending approvals</p><p className="font-display mt-3 text-4xl text-white">2</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Team members</p><p className="font-display mt-3 text-4xl text-white">3</p></article>
          </div>
        </div>

        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Portfolio pulse</p>
          <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Property-level performance</h3>
          <div className="mt-5 space-y-4">
            {portfolio.map((building) => (
              <article key={building.name} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">{building.name}</p>
                    <p className="text-sm text-fog">{building.units} active units • {building.occupancy} occupancy</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                    <div><p className="text-fog">Collected</p><p className="font-semibold text-ink">{building.collected}</p></div>
                    <div><p className="text-fog">Outstanding</p><p className="font-semibold text-ink">{building.outstanding}</p></div>
                    <div><p className="text-fog">Maintenance</p><p className="font-semibold text-ink">{building.maintenance}</p></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Approvals and cash integrity</p>
              <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Money cannot leave without your decision</h3>
            </div>
            <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Policy settings</button>
          </div>

          <div className="mt-6 space-y-4">
            {approvalQueue.map((item) => (
              <article key={item.title} className="rounded-[1.7rem] border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-xl">
                    <p className="font-display text-2xl font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-fog">{item.reason}</p>
                    <p className="mt-2 text-sm text-slate-600">Source account: {item.source}</p>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark">{item.state}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink">{item.amount}</span>
                    <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800">Decline</button>
                    <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Approve</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.8rem] border border-slate-200 bg-[#f8fbff] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fog">Cash movement view</p>
                <h4 className="font-display mt-2 text-2xl font-semibold text-ink">Income to reserve to owner release</h4>
              </div>
              <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800">Open report</button>
            </div>
            <div className="mt-5 space-y-4">
              {cashLanes.map((lane) => (
                <div key={lane.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink">{lane.label}</span>
                    <span className="text-fog">{lane.amount}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className={`h-3 rounded-full bg-gradient-to-r from-[#0f4c81] via-[#0d9488] to-[#34d399] ${lane.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Team access</p>
                <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">Set limits for every helper in the building</h3>
              </div>
              <select value={selectedMember} onChange={(event) => setSelectedMember(event.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none">
                {team.map((member) => (
                  <option key={member.name} value={member.name} className="text-black">{member.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-6 space-y-4">
              {team.map((member) => (
                <article key={member.name} className={`rounded-[1.6rem] border p-4 ${selectedMember === member.name ? "border-brand bg-white/8" : "border-white/10 bg-white/5"}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-display text-xl font-semibold">{member.name}</p>
                      <p className="text-sm text-fog">{member.role}</p>
                      <p className="mt-2 text-sm leading-7 text-fog">{member.focus}</p>
                    </div>
                    <div className="grid gap-2 text-sm text-fog">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={member.toggles.tenants} readOnly /> Tenant records</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={member.toggles.collections} readOnly /> Collections</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={member.toggles.payouts} readOnly /> Payouts</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={member.toggles.access} readOnly /> Team permissions</label>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Reports and insight</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">What needs attention this week</h3>
            <div className="mt-5 grid gap-4">
              {reports.map((report) => (
                <article key={report.title} className="rounded-[1.6rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{report.title}</p>
                      <p className="mt-1 text-sm text-fog">{report.detail}</p>
                    </div>
                    <p className="font-display text-3xl font-semibold text-brand-dark">{report.value}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
