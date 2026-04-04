"use client";

import { useState } from "react";

const tabs = ["Collections", "Reconciliation", "Access", "Automation"] as const;

const queues = {
  Collections: [
    { title: "Arrears follow-up", detail: "12 tenants crossed the grace-period threshold today." },
    { title: "Failed debit review", detail: "3 debit-order attempts need operator action." }
  ],
  Reconciliation: [
    { title: "Unmatched ATM deposit", detail: "R7,500 received without reference." },
    { title: "Fuzzy match candidate", detail: "Potential match found for Unit A12 transfer." }
  ],
  Access: [
    { title: "Owner permission request", detail: "Building manager access upgrade awaiting review." },
    { title: "Suspicious login activity", detail: "Flagged session on a finance profile requires check." }
  ],
  Automation: [
    { title: "Monthly invoice run", detail: "Scheduled for 00:05 on the first of next month." },
    { title: "Reminder sequence", detail: "Day-3 and day-7 arrears nudges are active." }
  ]
};

export function AdminWorkspace() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Collections");

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Admin control center</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            One command surface for the whole operating system.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-fog">
            Administrators need unlimited control, but that control has to be structured. This space centralizes collections, reconciliation, access, and automated policy execution.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Organizations</p><p className="font-display mt-3 text-4xl text-white">50</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Owners</p><p className="font-display mt-3 text-4xl text-white">50</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Tenants</p><p className="font-display mt-3 text-4xl text-white">500</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Platform staff</p><p className="font-display mt-3 text-4xl text-white">50</p></article>
          </div>
        </div>

        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Platform controls</p>
          <div className="mt-5 grid gap-3">
            <button className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-ink">Create organization</button>
            <button className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-ink">Assign admin roles</button>
            <button className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-ink">Override approval rule</button>
            <button className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-ink">Manage payment policies</button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Operator lanes</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? "bg-panel text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-4">
            {queues[activeTab].map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Unlimited admin control</p>
          <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">What the administrator can control</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="font-semibold text-white">Organizations</p><p className="mt-2 text-sm leading-7 text-fog">Create, suspend, audit, and inspect all buildings and ownership structures.</p></article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="font-semibold text-white">Users and roles</p><p className="mt-2 text-sm leading-7 text-fog">Set access boundaries for owners, building teams, finance staff, and support operators.</p></article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="font-semibold text-white">Money movement</p><p className="mt-2 text-sm leading-7 text-fog">Inspect invoices, force reconciliation, block payouts, and verify all audit trails.</p></article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="font-semibold text-white">Automation</p><p className="mt-2 text-sm leading-7 text-fog">Manage reminders, invoice runs, approval policies, and tenant communication triggers.</p></article>
          </div>
        </div>
      </section>
    </div>
  );
}
