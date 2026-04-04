"use client";

import { FormEvent, useState } from "react";

type AdminDashboardData = {
  metrics: {
    owners: number;
    tenants: number;
    buildings: number;
    organizations: number;
  };
  screenings: Array<{
    applicant: string;
    score: number;
    status: string;
    note: string;
  }>;
  propertySetup: Array<{
    step: string;
    state: string;
  }>;
} | null;

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

export function AdminWorkspace({ data }: { data?: AdminDashboardData }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Collections");
  const [organizationResult, setOrganizationResult] = useState("");
  const [propertyResult, setPropertyResult] = useState("");
  const [tenantResult, setTenantResult] = useState("");
  const [leaseResult, setLeaseResult] = useState("");
  const [screeningResult, setScreeningResult] = useState("");

  const metrics = data?.metrics ?? {
    owners: 0,
    tenants: 0,
    buildings: 0,
    organizations: 0
  };
  const screenings = data?.screenings?.length ? data.screenings : [
    { applicant: "No screening data yet", score: 0, status: "pending", note: "Create a tenant to start live screening." }
  ];
  const propertySetup = data?.propertySetup?.length ? data.propertySetup : [
    { step: "Organization", state: "Pending" },
    { step: "Property and units", state: "Pending" }
  ];

  async function submitJson(event: FormEvent<HTMLFormElement>, path: string, onResult: (message: string) => void) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    onResult(response.ok ? JSON.stringify(result) : result.error ?? "Request failed");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  async function submitTenant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      organizationId: String(formData.get("organizationId") ?? ""),
      email: String(formData.get("email") ?? ""),
      fullName: String(formData.get("fullName") ?? ""),
      password: String(formData.get("password") ?? ""),
      affordabilityScore: Number(formData.get("affordabilityScore") ?? 0),
      aiSummary: String(formData.get("aiSummary") ?? "")
    };

    const response = await fetch("/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setTenantResult(response.ok ? `Tenant created. ID: ${result.tenant.id}` : result.error ?? "Unable to create tenant");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  async function submitLease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      organizationId: String(formData.get("organizationId") ?? ""),
      unitId: String(formData.get("unitId") ?? ""),
      tenantId: String(formData.get("tenantId") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
      monthlyRentAmount: Number(formData.get("monthlyRentAmount") ?? 0),
      dueDate: String(formData.get("dueDate") ?? "")
    };

    const response = await fetch("/api/leases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setLeaseResult(response.ok ? `Lease created. Invoice ref: ${result.invoice.payment_reference_code}` : result.error ?? "Unable to create lease");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Admin control center</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            The live operating system for onboarding, collections, property setup, and platform control.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-fog">
            This view now supports actual creation flows. Admin can create organizations, properties, tenants, leases, invoices, and screening records from here.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Organizations</p><p className="font-display mt-3 text-4xl text-white">{metrics.organizations}</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Owners</p><p className="font-display mt-3 text-4xl text-white">{metrics.owners}</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Tenants</p><p className="font-display mt-3 text-4xl text-white">{metrics.tenants}</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Buildings</p><p className="font-display mt-3 text-4xl text-white">{metrics.buildings}</p></article>
          </div>
        </div>

        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Core actions</p>
          <div className="mt-5 grid gap-3">
            <form onSubmit={(event) => submitJson(event, "/api/organizations", setOrganizationResult)} className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
              <p className="font-semibold text-ink">Create organization</p>
              <div className="mt-3 grid gap-3">
                <input name="name" placeholder="Organization name" className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900" />
                <input name="baseCurrency" defaultValue="ZAR" placeholder="Currency" className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900" />
                <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Create</button>
                {organizationResult ? <p className="text-xs text-slate-600">{organizationResult}</p> : null}
              </div>
            </form>

            <form onSubmit={(event) => submitJson(event, "/api/properties", setPropertyResult)} className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
              <p className="font-semibold text-ink">Create property and units</p>
              <div className="mt-3 grid gap-3">
                <input name="organizationId" placeholder="Organization ID" className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900" />
                <input name="name" placeholder="Property name" className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900" />
                <input name="address" placeholder="Address" className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900" />
                <input name="unitCount" type="number" min="1" placeholder="Unit count" className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900" />
                <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Create property</button>
                {propertyResult ? <p className="text-xs text-slate-600">{propertyResult}</p> : null}
              </div>
            </form>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Tenant creation and screening</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">Create a tenant and start screening</h3>
            <form onSubmit={submitTenant} className="mt-5 grid gap-3 md:grid-cols-2">
              <input name="organizationId" placeholder="Organization ID" className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
              <input name="fullName" placeholder="Tenant full name" className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
              <input name="email" type="email" placeholder="Tenant email" className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
              <input name="password" placeholder="Temporary password" className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
              <input name="affordabilityScore" type="number" placeholder="Affordability score" className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
              <input name="aiSummary" placeholder="AI screening summary" className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
              <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white md:col-span-2">Create tenant</button>
              {tenantResult ? <p className="text-sm text-fog md:col-span-2">{tenantResult}</p> : null}
            </form>

            <div className="mt-6 space-y-4">
              {screenings.map((screening) => (
                <article key={`${screening.applicant}-${screening.status}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Lease and invoice creation</p>
                <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Occupy a unit and issue the first invoice</h3>
              </div>
            </div>
            <form onSubmit={submitLease} className="mt-5 grid gap-3 md:grid-cols-2">
              <input name="organizationId" placeholder="Organization ID" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="unitId" placeholder="Unit ID" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="tenantId" placeholder="Tenant ID" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="monthlyRentAmount" type="number" placeholder="Monthly rent" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="startDate" type="date" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="dueDate" type="date" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="endDate" type="date" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900 md:col-span-2" />
              <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white md:col-span-2">Create lease and invoice</button>
              {leaseResult ? <p className="text-sm text-slate-600 md:col-span-2">{leaseResult}</p> : null}
            </form>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Live setup board</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">What still blocks buildings from going live</h3>
            <div className="mt-5 space-y-3">
              {propertySetup.map((item) => (
                <article key={`${item.step}-${item.state}`} className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <div>
                    <p className="font-semibold text-ink">{item.step}</p>
                    <p className="text-sm text-fog">Admin-managed launch dependency</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${item.state.toLowerCase().includes("done") ? "bg-[#dcfce7] text-[#166534]" : item.state.toLowerCase().includes("progress") ? "bg-[#e0f2fe] text-[#0c4a6e]" : "bg-[#fef3c7] text-[#92400e]"}`}>
                    {item.state}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Screening action</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Create a manual screening check</h3>
            <form onSubmit={(event) => submitJson(event, "/api/screening", setScreeningResult)} className="mt-5 grid gap-3 md:grid-cols-2">
              <input name="organizationId" placeholder="Organization ID" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="applicantProfileId" placeholder="Applicant profile ID" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="affordabilityScore" type="number" placeholder="Affordability score" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="riskBand" placeholder="Risk band: low/moderate/high" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900" />
              <input name="aiSummary" placeholder="AI summary" className="rounded-[1rem] border border-slate-200 px-3 py-3 text-sm text-slate-900 md:col-span-2" />
              <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white md:col-span-2">Create screening</button>
              {screeningResult ? <p className="text-sm text-slate-600 md:col-span-2">{screeningResult}</p> : null}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
