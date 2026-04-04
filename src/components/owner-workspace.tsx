"use client";

import { useState } from "react";

const approvalQueue = [
  { title: "Caretaker payout", amount: "R3,200", reason: "Monthly site operations", state: "Needs approval" },
  { title: "Plumbing emergency", amount: "R5,950", reason: "Burst pipe in Block C", state: "Urgent" }
];

const team = [
  {
    name: "Musa Ndlovu",
    role: "Building manager",
    toggles: { tenants: true, collections: true, payouts: false, access: false }
  },
  {
    name: "Rethabile Mokoena",
    role: "Finance officer",
    toggles: { tenants: false, collections: true, payouts: false, access: false }
  },
  {
    name: "Lerato Dube",
    role: "Support lead",
    toggles: { tenants: true, collections: false, payouts: false, access: false }
  }
];

const portfolio = [
  { name: "Central Heights", units: 18, collected: "R126,000", outstanding: "R14,000" },
  { name: "Palm Court", units: 12, collected: "R88,500", outstanding: "R8,700" }
];

export function OwnerWorkspace() {
  const [selectedMember, setSelectedMember] = useState(team[0].name);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Owner workspace</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                Run buildings, control money, and set team limits without losing visibility.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-fog">
                This workspace is for decisions that affect assets: collections, operational spend, team permissions, and finance discipline across the portfolio.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white">
                Add payout account
              </button>
              <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Invite team member</button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Collected</p><p className="font-display mt-3 text-4xl text-white">R214,500</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Outstanding</p><p className="font-display mt-3 text-4xl text-white">R34,700</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Pending approvals</p><p className="font-display mt-3 text-4xl text-white">2</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Active team members</p><p className="font-display mt-3 text-4xl text-white">3</p></article>
          </div>
        </div>

        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Portfolio view</p>
          <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Buildings at a glance</h3>
          <div className="mt-5 space-y-4">
            {portfolio.map((building) => (
              <article key={building.name} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">{building.name}</p>
                    <p className="text-sm text-fog">{building.units} active units</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div><p className="text-fog">Collected</p><p className="font-semibold text-ink">{building.collected}</p></div>
                    <div><p className="text-fog">Outstanding</p><p className="font-semibold text-ink">{building.outstanding}</p></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Approval queue</p>
              <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Requests that need owner action</h3>
            </div>
            <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Open finance rules</button>
          </div>
          <div className="mt-6 space-y-4">
            {approvalQueue.map((item) => (
              <article key={item.title} className="rounded-[1.7rem] border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-display text-2xl font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-fog">{item.reason}</p>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark">{item.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink">{item.amount}</span>
                    <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800">Decline</button>
                    <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Approve</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Team access</p>
              <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">Control who can do what</h3>
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
                  </div>
                  <div className="grid gap-2 text-sm text-fog">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={member.toggles.tenants} readOnly /> Tenants</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={member.toggles.collections} readOnly /> Collections</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={member.toggles.payouts} readOnly /> Payouts</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={member.toggles.access} readOnly /> Team access</label>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

