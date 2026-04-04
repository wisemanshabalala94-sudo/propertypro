"use client";

import { useState } from "react";

const tabs = ["Collections", "Screening", "Setup", "Automation"] as const;

const queues = {
  Collections: [
    { title: "Arrears follow-up", detail: "12 tenants crossed the grace-period threshold today.", action: "Trigger reminder wave" },
    { title: "Failed debit review", detail: "3 debit-order attempts need operator action.", action: "Move to manual collection" }
  ],
  Screening: [
    { title: "Applicant affordability drift", detail: "3 screenings need updated statements before final approval.", action: "Request fresh documents" },
    { title: "Identity mismatch", detail: "One screening returned a name mismatch on the uploaded ID.", action: "Hold application" }
  ],
  Setup: [
    { title: "New building intake", detail: "Block 5 owner created the organization but units are not configured yet.", action: "Launch setup checklist" },
    { title: "Lease template missing", detail: "Two properties have tenants waiting for generated lease packs.", action: "Publish lease template" }
  ],
  Automation: [
    { title: "Monthly invoice run", detail: "Scheduled for 00:05 on the first of next month.", action: "Inspect scheduler" },
    { title: "Maintenance AI triage", detail: "Average first triage time is down to 2 minutes.", action: "Review edge cases" }
  ]
};

const screeningQueue = [
  { applicant: "Anele Dlamini", score: 78, status: "Approved", note: "Stable income, docs verified, low risk." },
  { applicant: "Karabo Maseko", score: 61, status: "Needs more info", note: "Three-month statement set incomplete." },
  { applicant: "Yolanda Sithole", score: 49, status: "In review", note: "AI flagged affordability pressure." }
];

const propertySetup = [
  { step: "Organization", state: "Done" },
  { step: "Property and units", state: "In progress" },
  { step: "Lease templates", state: "Pending" },
  { step: "Tenant import", state: "Pending" },
  { step: "Collection rules", state: "Done" }
];

const adminMetrics = [
  { label: "Owners", value: "50" },
  { label: "Tenants", value: "500" },
  { label: "Buildings", value: "50" },
  { label: "Platform staff", value: "50" }
];

export function AdminWorkspace() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Collections");

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Admin control center</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            The live operating system for onboarding, collections, property setup, and platform control.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-fog">
            Admins need command-level clarity: who is being screened, which leases are waiting, where cash integrity is slipping,
            and which buildings still need setup before they can go fully live.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {adminMetrics.map((metric) => (
              <article key={metric.label} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-mist">{metric.label}</p>
                <p className="font-display mt-3 text-4xl text-white">{metric.value}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Core actions</p>
          <div className="mt-5 grid gap-3">
            <button className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-ink">Create organization and owner profile</button>
            <button className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-ink">Run tenant screening batch</button>
            <button className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-ink">Generate lease agreements</button>
            <button className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-ink">Open payment policy controls</button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Operator lanes</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? "bg-panel text-white" : "border border-slate-200 bg-white text-slate-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-4">
            {queues[activeTab].map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">{item.detail}</p>
                <button className="mt-3 rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark">
                  {item.action}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Tenant screening</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">Approve the right tenants faster</h3>
            <div className="mt-5 space-y-4">
              {screeningQueue.map((screening) => (
                <article key={screening.applicant} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-display text-xl font-semibold">{screening.applicant}</p>
                      <p className="mt-1 text-sm text-fog">{screening.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-mist">Affordability score</p>
                      <p className="font-display text-3xl font-semibold">{screening.score}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-mist">{screening.status}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Property setup</p>
                <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">What still blocks a building from going live</h3>
              </div>
              <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Open setup wizard</button>
            </div>
            <div className="mt-5 space-y-3">
              {propertySetup.map((item) => (
                <article key={item.step} className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <div>
                    <p className="font-semibold text-ink">{item.step}</p>
                    <p className="text-sm text-fog">Admin-managed launch dependency</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${item.state === "Done" ? "bg-[#dcfce7] text-[#166534]" : item.state === "In progress" ? "bg-[#e0f2fe] text-[#0c4a6e]" : "bg-[#fef3c7] text-[#92400e]"}`}>
                    {item.state}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Platform reporting</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Custom analytics you can actually act on</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4"><p className="text-sm text-fog">Collection health</p><p className="font-display mt-2 text-3xl text-ink">91%</p></article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4"><p className="text-sm text-fog">Screening turnaround</p><p className="font-display mt-2 text-3xl text-ink">18h</p></article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4"><p className="text-sm text-fog">Maintenance SLA</p><p className="font-display mt-2 text-3xl text-ink">81%</p></article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
