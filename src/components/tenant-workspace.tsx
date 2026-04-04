"use client";

import { useState } from "react";

const invoiceRows = [
  {
    id: "INV-2026-04-A12",
    period: "April 2026",
    amount: "R7,500",
    due: "5 Apr 2026",
    status: "Due now",
    method: "Bank deposit",
    reference: "PPR-TNT-A12-0426",
    autopay: "Switch to debit order"
  },
  {
    id: "INV-2026-03-A12",
    period: "March 2026",
    amount: "R7,500",
    due: "5 Mar 2026",
    status: "Paid",
    method: "Paystack",
    reference: "PPR-TNT-A12-0326",
    autopay: "Autopay active"
  }
];

const maintenanceRequests = [
  {
    title: "Kitchen sink leak",
    priority: "High",
    status: "Triaged",
    update: "AI triage routed this to plumbing and estimated same-day attendance."
  },
  {
    title: "Hallway light not working",
    priority: "Standard",
    status: "In progress",
    update: "Building manager accepted the task and assigned it to the electrician."
  }
];

const uploads = [
  { name: "Bank statement - January", state: "Verified" },
  { name: "Bank statement - February", state: "Verified" },
  { name: "Bank statement - March", state: "Needed" },
  { name: "Debit mandate", state: "Awaiting signature" },
  { name: "Proof of address", state: "Verified" }
];

const activity = [
  { time: "09:12", title: "Rent reminder sent", description: "Your payment route was updated with the correct next action." },
  { time: "10:04", title: "Reference locked", description: "Your bank-deposit reference is unique to this tenant and invoice cycle." },
  { time: "11:28", title: "Screening review passed", description: "Identity and affordability review moved to final approval." }
];

const paymentMethods = {
  paystack: {
    title: "Paystack checkout",
    summary: "Best for instant settlement and fast receipt delivery.",
    detail: "Checkout confirms card and digital payment events immediately so your invoice can close in the same flow."
  },
  deposit: {
    title: "Bank deposit",
    summary: "Use your tenant-only reference for clean auto-allocation.",
    detail: "Your reference is unique to you. If you deposit without it, reconciliation can be delayed and admin review may be needed."
  },
  debit: {
    title: "Debit order",
    summary: "Best for recurring payments and fewer missed due dates.",
    detail: "Once your mandate is signed, collections can run automatically on the agreed day each month."
  }
} as const;

export function TenantWorkspace() {
  const [selectedMethod, setSelectedMethod] = useState<keyof typeof paymentMethods>("deposit");

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Tenant workspace</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                Everything a tenant needs to pay, upload, request help, and move forward.
              </h2>
              <p className="mt-3 text-sm leading-7 text-fog">
                No clutter. Just your current rent position, the right payment path, your unique reference, your documents,
                and a maintenance lane that updates clearly when something breaks.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-panel">
                Pay current invoice
              </button>
              <button className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white">
                New maintenance request
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Current due</p>
              <p className="font-display mt-3 text-4xl text-white">R7,500</p>
              <p className="mt-2 text-sm text-fog">Due 5 Apr 2026</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Deposit reference</p>
              <p className="font-display mt-3 text-2xl text-white md:text-3xl">PPR-TNT-A12-0426</p>
              <p className="mt-2 text-sm text-fog">Unique to this tenant only.</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Documents complete</p>
              <p className="font-display mt-3 text-4xl text-white">4/5</p>
              <p className="mt-2 text-sm text-fog">One bank statement still required.</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Open repairs</p>
              <p className="font-display mt-3 text-4xl text-white">2</p>
              <p className="mt-2 text-sm text-fog">One high-priority request active.</p>
            </article>
          </div>
        </div>

        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Payment route</p>
          <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Choose how this month gets settled</h3>
          <div className="mt-5 grid gap-3">
            {(Object.entries(paymentMethods) as Array<[keyof typeof paymentMethods, (typeof paymentMethods)[keyof typeof paymentMethods]]>).map(([key, method]) => (
              <button
                key={key}
                onClick={() => setSelectedMethod(key)}
                className={`rounded-[1.5rem] border p-4 text-left transition ${selectedMethod === key ? "border-brand bg-sand" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{method.title}</p>
                    <p className="mt-1 text-sm leading-7 text-slate-600">{method.summary}</p>
                  </div>
                  <span className={`h-3 w-3 rounded-full ${selectedMethod === key ? "bg-brand" : "bg-slate-300"}`} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-slate-200 bg-white p-5">
            <p className="font-semibold text-ink">{paymentMethods[selectedMethod].title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{paymentMethods[selectedMethod].detail}</p>
            {selectedMethod === "deposit" ? (
              <div className="mt-4 rounded-[1.25rem] bg-[#f5f8ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fog">Reference to use</p>
                <p className="mt-2 font-mono text-lg text-brand-dark">PPR-TNT-A12-0426</p>
              </div>
            ) : null}
            {selectedMethod === "debit" ? (
              <div className="mt-4 rounded-[1.25rem] bg-[#f5f8ff] p-4 text-sm text-slate-600">
                Mandate status: awaiting signature from tenant profile.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Rent ledger</p>
              <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Invoices and auto-collection status</h3>
            </div>
            <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
              Download statement
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {invoiceRows.map((row) => (
              <article key={row.id} className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">{row.period}</p>
                    <p className="mt-1 text-sm text-fog">{row.due}</p>
                  </div>
                  <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-4">
                    <div>
                      <p className="text-fog">Amount</p>
                      <p className="font-semibold text-ink">{row.amount}</p>
                    </div>
                    <div>
                      <p className="text-fog">Status</p>
                      <p className="font-semibold text-ink">{row.status}</p>
                    </div>
                    <div>
                      <p className="text-fog">Method</p>
                      <p className="font-semibold text-ink">{row.method}</p>
                    </div>
                    <div>
                      <p className="text-fog">Next step</p>
                      <p className="font-semibold text-brand-dark">{row.autopay}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-[1.3rem] bg-[#f5f8ff] px-4 py-3 text-sm text-slate-600">
                  Reference: <span className="font-mono text-brand-dark">{row.reference}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Maintenance</p>
                <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Requests and AI triage</h3>
              </div>
              <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Request repair</button>
            </div>
            <div className="mt-5 space-y-3">
              {maintenanceRequests.map((request) => (
                <article key={request.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-ink">{request.title}</p>
                      <p className="mt-1 text-sm text-fog">{request.update}</p>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                      <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-[#92400e]">{request.priority}</span>
                      <span className="rounded-full bg-[#e0f2fe] px-3 py-1 text-[#0c4a6e]">{request.status}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Document center</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Upload what is still required</h3>
            <div className="mt-5 space-y-3">
              {uploads.map((upload) => (
                <article key={upload.name} className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{upload.name}</p>
                      <p className="text-sm text-fog">{upload.state}</p>
                    </div>
                    <button className="rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark">
                      Upload
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Live feed</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">What changed today</h3>
            <div className="mt-5 space-y-4">
              {activity.map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex gap-4">
                    <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-mist">
                      {item.time}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-7 text-fog">{item.description}</p>
                    </div>
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
