"use client";

import { FormEvent, useMemo, useState } from "react";

type TenantDashboardData = {
  tenant: { id: string; organization_id: string; full_name: string | null; email: string };
  summary: {
    currentDue: string;
    reference: string;
    openRepairs: number;
    documentsComplete: string;
  };
  invoices: Array<{
    id: string;
    period: string;
    amount: string;
    due: string;
    status: string;
    method: string;
    reference: string;
    autopay: string;
  }>;
  maintenance: Array<{
    title: string;
    priority: string;
    status: string;
    update: string;
  }>;
  uploads: Array<{
    name: string;
    state: string;
  }>;
} | null;

const fallbackInvoices = [
  {
    id: "INV-2026-04-A12",
    period: "April 2026",
    amount: "R7,500",
    due: "2026-04-05",
    status: "unpaid",
    method: "Bank deposit",
    reference: "PPR-TNT-A12-0426",
    autopay: "Switch to debit order"
  }
];

const fallbackMaintenance = [
  {
    title: "Kitchen sink leak",
    priority: "High",
    status: "Triaged",
    update: "AI triage routed this to plumbing and estimated same-day attendance."
  }
];

const fallbackUploads = [
  { name: "bank statement", state: "needed" },
  { name: "debit mandate", state: "awaiting_signature" }
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

export function TenantWorkspace({ data }: { data?: TenantDashboardData }) {
  const [selectedMethod, setSelectedMethod] = useState<keyof typeof paymentMethods>("deposit");
  const [maintenanceTitle, setMaintenanceTitle] = useState("");
  const [maintenanceDescription, setMaintenanceDescription] = useState("");
  const [maintenanceStatus, setMaintenanceStatus] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const tenant = data?.tenant;
  const summary = data?.summary ?? {
    currentDue: "R7,500",
    reference: "PPR-TNT-A12-0426",
    openRepairs: 1,
    documentsComplete: "0/2"
  };
  const invoices = data?.invoices?.length ? data.invoices : fallbackInvoices;
  const maintenanceItems = data?.maintenance?.length ? data.maintenance : fallbackMaintenance;
  const uploads = data?.uploads?.length ? data.uploads : fallbackUploads;
  const currentInvoice = invoices[0];

  const uploadBucket = useMemo(() => "tenant-documents", []);

  async function submitMaintenance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tenant) {
      setMaintenanceStatus("Create a tenant in admin first, then maintenance can be submitted live.");
      return;
    }

    const response = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: tenant.organization_id,
        tenantId: tenant.id,
        category: "other",
        priority: "standard",
        title: maintenanceTitle,
        description: maintenanceDescription,
        aiTriageSummary: "Auto-submitted from tenant workspace and waiting for admin routing."
      })
    });

    const payload = await response.json();
    setMaintenanceStatus(response.ok ? `Maintenance request created: ${payload.request.title}` : payload.error ?? "Unable to submit request");
    if (response.ok) {
      setMaintenanceTitle("");
      setMaintenanceDescription("");
    }
  }

  async function submitDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tenant) {
      setUploadStatus("Create a tenant in admin first, then document uploads can be stored.");
      return;
    }

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("tenantDocument") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setUploadStatus("Choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("organizationId", tenant.organization_id);
    formData.append("bucket", uploadBucket);
    formData.append("documentType", "bank_statement");
    formData.append("file", file);

    const response = await fetch("/api/uploads/document", {
      method: "POST",
      body: formData
    });

    const payload = await response.json();
    setUploadStatus(response.ok ? `Uploaded to ${payload.bucket}/${payload.path}` : payload.error ?? "Upload failed");
    if (response.ok) {
      form.reset();
    }
  }

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
                Rent, maintenance, and compliance now sit in one place. The payment reference shown here is unique to the tenant using bank deposits.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-fog">
              {tenant ? `Live tenant: ${tenant.full_name ?? tenant.email}` : "No live tenant found yet. Use the admin workspace to create one."}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Current due</p>
              <p className="font-display mt-3 text-4xl text-white">{summary.currentDue}</p>
              <p className="mt-2 text-sm text-fog">{currentInvoice?.due ?? "No due date yet"}</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Deposit reference</p>
              <p className="font-display mt-3 text-2xl text-white md:text-3xl">{summary.reference}</p>
              <p className="mt-2 text-sm text-fog">Unique to this tenant only.</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Documents complete</p>
              <p className="font-display mt-3 text-4xl text-white">{summary.documentsComplete}</p>
              <p className="mt-2 text-sm text-fog">Uploads sync into onboarding review.</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist">Open repairs</p>
              <p className="font-display mt-3 text-4xl text-white">{summary.openRepairs}</p>
              <p className="mt-2 text-sm text-fog">Maintenance status is tracked in-app.</p>
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
                <p className="font-semibold text-ink">{method.title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">{method.summary}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-slate-200 bg-white p-5">
            <p className="font-semibold text-ink">{paymentMethods[selectedMethod].title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{paymentMethods[selectedMethod].detail}</p>
            {selectedMethod === "deposit" ? (
              <div className="mt-4 rounded-[1.25rem] bg-[#f5f8ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fog">Reference to use</p>
                <p className="mt-2 font-mono text-lg text-brand-dark">{summary.reference}</p>
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
              <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Invoices and collection status</h3>
            </div>
            <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
              Download statement
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {invoices.map((row) => (
              <article key={row.id} className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">{row.period}</p>
                    <p className="mt-1 text-sm text-fog">{row.due}</p>
                  </div>
                  <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-4">
                    <div><p className="text-fog">Amount</p><p className="font-semibold text-ink">{row.amount}</p></div>
                    <div><p className="text-fog">Status</p><p className="font-semibold text-ink">{row.status}</p></div>
                    <div><p className="text-fog">Method</p><p className="font-semibold text-ink">{row.method}</p></div>
                    <div><p className="text-fog">Next step</p><p className="font-semibold text-brand-dark">{row.autopay}</p></div>
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
                <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Submit a real request</h3>
              </div>
            </div>

            <form onSubmit={submitMaintenance} className="mt-5 space-y-3">
              <input
                value={maintenanceTitle}
                onChange={(event) => setMaintenanceTitle(event.target.value)}
                placeholder="Issue title"
                className="w-full rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              />
              <textarea
                value={maintenanceDescription}
                onChange={(event) => setMaintenanceDescription(event.target.value)}
                placeholder="Describe what needs attention"
                rows={4}
                className="w-full rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              />
              <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Send request</button>
              {maintenanceStatus ? <p className="text-sm text-slate-600">{maintenanceStatus}</p> : null}
            </form>

            <div className="mt-5 space-y-3">
              {maintenanceItems.map((request) => (
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
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Upload into Supabase storage</h3>
            <form onSubmit={submitDocument} className="mt-5 space-y-3">
              <input
                name="tenantDocument"
                type="file"
                className="block w-full rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              />
              <button className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-brand-dark">Upload document</button>
              {uploadStatus ? <p className="text-sm text-slate-600">{uploadStatus}</p> : null}
            </form>
            <div className="mt-5 space-y-3">
              {uploads.map((upload) => (
                <article key={upload.name} className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold capitalize text-ink">{upload.name}</p>
                      <p className="text-sm text-fog">{upload.state}</p>
                    </div>
                    <span className="rounded-full bg-[#f5f8ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark">
                      tracked
                    </span>
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
