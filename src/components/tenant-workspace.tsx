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
    reference: "PPR-A12-APR26"
  },
  {
    id: "INV-2026-03-A12",
    period: "March 2026",
    amount: "R7,500",
    due: "5 Mar 2026",
    status: "Paid",
    method: "Paystack",
    reference: "PPR-A12-MAR26"
  }
];

const uploads = [
  { name: "Bank statement - January", state: "Verified" },
  { name: "Bank statement - February", state: "Verified" },
  { name: "Bank statement - March", state: "Needed" },
  { name: "Debit mandate", state: "Awaiting signature" }
];

const activity = [
  { time: "09:12", title: "Rent reminder issued", description: "Reminder sent through in-app notification and email." },
  { time: "10:04", title: "Reference generated", description: "Unique bank-deposit reference locked to tenant profile." },
  { time: "11:28", title: "Document review updated", description: "Two statement uploads verified by admin review queue." }
];

export function TenantWorkspace() {
  const [selectedMethod, setSelectedMethod] = useState<"paystack" | "deposit" | "debit">("deposit");

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Tenant workspace</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                Pay rent, track progress, and stay compliant without friction.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-fog">
                This space keeps the tenant focused on what matters: what is due, which reference to use, what documents are still outstanding, and what action to take next.
              </p>
            </div>
            <button className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-panel">
              Pay current invoice
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Current due</p>
              <p className="font-display mt-3 text-4xl text-white">R7,500</p>
              <p className="mt-2 text-sm text-fog">Due 5 Apr 2026</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Deposit reference</p>
              <p className="font-display mt-3 text-3xl text-white">PPR-A12-APR26</p>
              <p className="mt-2 text-sm text-fog">Unique to this tenant for bank deposits.</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Onboarding status</p>
              <p className="font-display mt-3 text-3xl text-white">83%</p>
              <p className="mt-2 text-sm text-fog">One statement and one mandate step remaining.</p>
            </article>
          </div>
        </div>

        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Payment options</p>
          <div className="mt-4 grid gap-3">
            <button
              onClick={() => setSelectedMethod("paystack")}
              className={`rounded-[1.4rem] border p-4 text-left transition ${selectedMethod === "paystack" ? "border-brand bg-sand" : "border-slate-200 bg-white"}`}
            >
              <p className="font-semibold text-ink">Paystack checkout</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">Instant confirmation with card or supported digital channels.</p>
            </button>
            <button
              onClick={() => setSelectedMethod("deposit")}
              className={`rounded-[1.4rem] border p-4 text-left transition ${selectedMethod === "deposit" ? "border-brand bg-sand" : "border-slate-200 bg-white"}`}
            >
              <p className="font-semibold text-ink">Bank deposit</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">Use the exact tenant reference so the system auto-matches your payment.</p>
            </button>
            <button
              onClick={() => setSelectedMethod("debit")}
              className={`rounded-[1.4rem] border p-4 text-left transition ${selectedMethod === "debit" ? "border-brand bg-sand" : "border-slate-200 bg-white"}`}
            >
              <p className="font-semibold text-ink">Debit order</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">Automated collection on the day agreed in your mandate.</p>
            </button>
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-slate-200 bg-white p-4">
            {selectedMethod === "paystack" && (
              <>
                <p className="font-semibold text-ink">Recommended for fastest settlement</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">You will be redirected to a secure checkout and receive confirmation when the payment posts.</p>
              </>
            )}
            {selectedMethod === "deposit" && (
              <>
                <p className="font-semibold text-ink">Use this reference exactly</p>
                <p className="mt-2 font-mono text-lg text-brand-dark">PPR-A12-APR26</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">This reference is unique to the tenant and invoice cycle. Missing it may delay allocation.</p>
              </>
            )}
            {selectedMethod === "debit" && (
              <>
                <p className="font-semibold text-ink">Mandate still required</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">Complete the debit authorization so the system can schedule automated rent collection.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Invoices</p>
              <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Rent ledger</h3>
            </div>
            <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
              Download statement
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white">
            <div className="hidden grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr] gap-4 border-b border-slate-200 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-fog md:grid">
              <span>Period</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Method</span>
              <span>Reference</span>
            </div>
            {invoiceRows.map((row) => (
              <div key={row.id} className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr] md:items-center">
                <div>
                  <p className="font-semibold text-ink">{row.period}</p>
                  <p className="text-sm text-fog">{row.due}</p>
                </div>
                <p className="font-semibold text-ink">{row.amount}</p>
                <p className="text-sm text-slate-600">{row.status}</p>
                <p className="text-sm text-slate-600">{row.method}</p>
                <p className="font-mono text-sm text-brand-dark">{row.reference}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Document checklist</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">What still needs attention</h3>
            <div className="mt-5 space-y-3">
              {uploads.map((upload) => (
                <article key={upload.name} className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{upload.name}</p>
                      <p className="text-sm text-fog">{upload.state}</p>
                    </div>
                    <button className="rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark">
                      Update
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Activity</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">Live tenant feed</h3>
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

