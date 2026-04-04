"use client";

import { FormEvent, useMemo, useState } from "react";

type OwnerDashboardData = {
  owner: { id: string; organization_id: string; full_name: string | null };
  summary: {
    collected: string;
    outstanding: string;
    pendingApprovals: number;
    teamMembers: number;
  };
  approvals: Array<{
    title: string;
    amount: string;
    reason: string;
    state: string;
    source: string;
  }>;
  portfolio: Array<{
    name: string;
    units: number;
    occupancy: string;
    collected: string;
    outstanding: string;
    maintenance: string;
  }>;
  reportCards: Array<{
    title: string;
    value: string;
    detail: string;
  }>;
  subscription: {
    monthlyFee: string;
    status: string;
    nextBillingDate: string;
  };
  invitations: Array<{
    email: string;
    role: string;
    status: string;
  }>;
  workerPayouts: Array<{
    workerName: string;
    roleLabel: string;
    amount: string;
    status: string;
  }>;
  messages: Array<{
    subject: string;
    type: string;
    createdAt: string;
  }>;
} | null;

const fallbackPortfolio = [
  { name: "Central Heights", units: 18, occupancy: "94%", collected: "R126,000", outstanding: "R14,000", maintenance: "3 open" }
];

const fallbackApprovals = [
  { title: "Caretaker payout", amount: "R3,200", reason: "Monthly site operations", state: "pending", source: "Income account" }
];

const fallbackReports = [
  { title: "Collections integrity", value: "92%", detail: "Paid or scheduled before grace-period breach." }
];

export function OwnerWorkspace({ data }: { data?: OwnerDashboardData }) {
  const [directoryResult, setDirectoryResult] = useState("");
  const [subscriptionResult, setSubscriptionResult] = useState("");
  const [inviteResult, setInviteResult] = useState("");
  const [payoutResult, setPayoutResult] = useState("");
  const [messageResult, setMessageResult] = useState("");

  const owner = data?.owner;
  const summary = data?.summary ?? {
    collected: "R214,500",
    outstanding: "R34,700",
    pendingApprovals: 1,
    teamMembers: 0
  };
  const approvals = data?.approvals?.length ? data.approvals : fallbackApprovals;
  const portfolio = data?.portfolio?.length ? data.portfolio : fallbackPortfolio;
  const reportCards = data?.reportCards?.length ? data.reportCards : fallbackReports;
  const subscription = data?.subscription ?? {
    monthlyFee: "R1,170",
    status: "not_started",
    nextBillingDate: "Set up in owner portal"
  };
  const invitations = data?.invitations ?? [];
  const workerPayouts = data?.workerPayouts ?? [];
  const messages = data?.messages ?? [];

  const cashLanes = useMemo(
    () => [
      { label: "Gross rent in", amount: summary.collected, width: "w-full" },
      { label: "Reserved for Wiseworx savings", amount: "R20,000", width: "w-10/12" },
      { label: "Approved owner release", amount: summary.collected, width: "w-9/12" }
    ],
    [summary.collected]
  );

  async function submitJson(event: FormEvent<HTMLFormElement>, path: string, onResult: (message: string) => void, transform?: (formData: FormData) => Record<string, unknown>) {
    event.preventDefault();
    if (!owner) {
      onResult("Create an owner account first so this portal can act on a real organization.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = transform ? transform(formData) : Object.fromEntries(formData.entries());
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

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Owner portal</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                Subscription, staff, payouts, and property control all start here.
              </h2>
              <p className="mt-3 text-sm leading-7 text-fog">
                The owner is the paying customer. This portal sets the monthly service subscription, publishes the property directory, assigns admins and staff, and controls every approval that moves money.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-fog">
              {owner ? `Owner organization: ${owner.organization_id}` : "No live owner found yet."}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Collected</p><p className="font-display mt-3 text-4xl text-white">{summary.collected}</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Outstanding</p><p className="font-display mt-3 text-4xl text-white">{summary.outstanding}</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Pending approvals</p><p className="font-display mt-3 text-4xl text-white">{summary.pendingApprovals}</p></article>
            <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"><p className="text-[11px] uppercase tracking-[0.24em] text-mist">Team members</p><p className="font-display mt-3 text-4xl text-white">{summary.teamMembers}</p></article>
          </div>
        </div>

        <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Owner subscription</p>
          <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">R1170 per month per owner account</h3>
          <div className="mt-5 rounded-[1.6rem] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-fog">Monthly fee</p>
                <p className="font-display mt-1 text-3xl text-ink">{subscription.monthlyFee}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-fog">Status</p>
                <p className="font-semibold capitalize text-ink">{subscription.status}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">Next billing date: {subscription.nextBillingDate}</p>
          </div>
          <form
            onSubmit={(event) =>
              submitJson(event, "/api/owner-subscription", setSubscriptionResult, () => ({
                organizationId: owner?.organization_id,
                ownerProfileId: owner?.id,
                monthlyFee: 1170
              }))
            }
            className="mt-5"
          >
            <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Activate or refresh subscription</button>
            {subscriptionResult ? <p className="mt-3 text-xs text-slate-600">{subscriptionResult}</p> : null}
          </form>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <div className="space-y-6">
          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Publish properties</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Control which buildings appear on the landing page</h3>
            <form
              onSubmit={(event) =>
                submitJson(event, "/api/property-directory", setDirectoryResult, (formData) => ({
                  organizationId: owner?.organization_id,
                  propertyId: String(formData.get("propertyId") ?? ""),
                  slug: String(formData.get("slug") ?? ""),
                  signupNotes: String(formData.get("signupNotes") ?? ""),
                  isPublicSignupEnabled: true
                }))
              }
              className="mt-5 grid gap-3"
            >
              <input name="propertyId" placeholder="Property ID" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
              <input name="slug" placeholder="Directory slug" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
              <textarea name="signupNotes" placeholder="What tenants should know before signing up" rows={3} className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
              <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Publish property entry</button>
              {directoryResult ? <p className="text-xs text-slate-600">{directoryResult}</p> : null}
            </form>
          </div>

          <div className="glass-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Staff access and credentials</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">Invite admins and building staff from here</h3>
            <form
              onSubmit={(event) =>
                submitJson(event, "/api/team-invitations", setInviteResult, (formData) => ({
                  organizationId: owner?.organization_id,
                  invitedByProfileId: owner?.id,
                  invitedEmail: String(formData.get("invitedEmail") ?? ""),
                  fullName: String(formData.get("fullName") ?? ""),
                  role: String(formData.get("role") ?? "admin"),
                  accessScope: {
                    tenants: formData.get("tenants") === "on",
                    collections: formData.get("collections") === "on",
                    payouts: formData.get("payouts") === "on",
                    teamAccess: formData.get("teamAccess") === "on"
                  }
                }))
              }
              className="mt-5 grid gap-3"
            >
              <input name="fullName" placeholder="Full name" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
              <input name="invitedEmail" type="email" placeholder="Email address" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
              <select name="role" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                <option value="admin" className="text-black">Admin</option>
                <option value="vendor" className="text-black">Building staff</option>
                <option value="owner" className="text-black">Co-owner</option>
              </select>
              <div className="grid gap-2 text-sm text-fog md:grid-cols-2">
                <label className="flex items-center gap-2"><input name="tenants" type="checkbox" /> Tenant access</label>
                <label className="flex items-center gap-2"><input name="collections" type="checkbox" /> Collections</label>
                <label className="flex items-center gap-2"><input name="payouts" type="checkbox" /> Worker payouts</label>
                <label className="flex items-center gap-2"><input name="teamAccess" type="checkbox" /> Team access</label>
              </div>
              <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Send invitation</button>
              {inviteResult ? <p className="text-xs text-fog">{inviteResult}</p> : null}
            </form>

            <div className="mt-6 space-y-3">
              {invitations.length ? invitations.map((invitation) => (
                <article key={`${invitation.email}-${invitation.role}`} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{invitation.email}</p>
                      <p className="text-sm text-fog">{invitation.role}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-mist">{invitation.status}</span>
                  </div>
                </article>
              )) : (
                <article className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm text-fog">
                  No staff invitations yet. This is where the owner assigns admins and team members.
                </article>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Approvals and cash integrity</p>
                <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Money cannot leave without your decision</h3>
              </div>
              <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Policy settings</button>
            </div>

            <div className="mt-6 space-y-4">
              {approvals.map((item) => (
                <article key={`${item.title}-${item.amount}`} className="rounded-[1.7rem] border border-slate-200 bg-white p-5">
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

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="light-panel gradient-stroke rounded-[2.2rem] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Worker payouts</p>
              <h3 className="font-display mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">Prepare worker payments in-app</h3>
              <form
                onSubmit={(event) =>
                  submitJson(event, "/api/worker-payouts", setPayoutResult, (formData) => ({
                    organizationId: owner?.organization_id,
                    requestedByProfileId: owner?.id,
                    workerName: String(formData.get("workerName") ?? ""),
                    workerEmail: String(formData.get("workerEmail") ?? ""),
                    roleLabel: String(formData.get("roleLabel") ?? ""),
                    amount: Number(formData.get("amount") ?? 0),
                    payoutCycle: String(formData.get("payoutCycle") ?? "ad_hoc"),
                    notes: String(formData.get("notes") ?? "")
                  }))
                }
                className="mt-5 grid gap-3"
              >
                <input name="workerName" placeholder="Worker name" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
                <input name="workerEmail" placeholder="Worker email" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
                <input name="roleLabel" placeholder="Role label" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
                <input name="amount" type="number" placeholder="Amount" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
                <select name="payoutCycle" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="ad_hoc">Ad hoc</option>
                </select>
                <textarea name="notes" rows={3} placeholder="Reason or notes" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
                <button className="rounded-full bg-panel px-4 py-2 text-sm font-semibold text-white">Create payout request</button>
                {payoutResult ? <p className="text-xs text-slate-600">{payoutResult}</p> : null}
              </form>
              <div className="mt-5 space-y-3">
                {workerPayouts.length ? workerPayouts.map((payout) => (
                  <article key={`${payout.workerName}-${payout.amount}`} className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
                    <p className="font-semibold text-ink">{payout.workerName}</p>
                    <p className="text-sm text-fog">{payout.roleLabel}</p>
                    <p className="mt-2 text-sm text-slate-600">{payout.amount} • {payout.status}</p>
                  </article>
                )) : null}
              </div>
            </div>

            <div className="glass-panel gradient-stroke rounded-[2.2rem] p-6 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">In-app messaging</p>
              <h3 className="font-display mt-2 text-2xl font-semibold tracking-[-0.03em]">Communicate with tenants and staff</h3>
              <form
                onSubmit={(event) =>
                  submitJson(event, "/api/messages", setMessageResult, (formData) => ({
                    organizationId: owner?.organization_id,
                    senderProfileId: owner?.id,
                    subject: String(formData.get("subject") ?? ""),
                    body: String(formData.get("body") ?? ""),
                    messageType: String(formData.get("messageType") ?? "general")
                  }))
                }
                className="mt-5 grid gap-3"
              >
                <input name="subject" placeholder="Message subject" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
                <select name="messageType" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                  <option value="general" className="text-black">General</option>
                  <option value="payment" className="text-black">Payment</option>
                  <option value="maintenance" className="text-black">Maintenance</option>
                  <option value="dispute" className="text-black">Dispute</option>
                </select>
                <textarea name="body" rows={4} placeholder="Write a message to your property users" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
                <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Send message</button>
                {messageResult ? <p className="text-xs text-fog">{messageResult}</p> : null}
              </form>
              <div className="mt-5 space-y-3">
                {messages.length ? messages.map((message) => (
                  <article key={`${message.subject}-${message.createdAt}`} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold">{message.subject}</p>
                    <p className="text-sm text-fog">{message.type}</p>
                  </article>
                )) : (
                  <article className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm text-fog">
                    No messages yet. Owners, admins, tenants, and staff can communicate here about payments, disputes, and maintenance.
                  </article>
                )}
              </div>
            </div>
          </div>

          <div className="light-panel gradient-stroke rounded-[2.4rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Reports and insight</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">What needs attention this week</h3>
            <div className="mt-5 grid gap-4">
              {reportCards.map((report) => (
                <article key={`${report.title}-${report.value}`} className="rounded-[1.6rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold capitalize text-ink">{report.title}</p>
                      <p className="mt-1 text-sm text-fog">{report.detail}</p>
                    </div>
                    <p className="font-display text-3xl font-semibold text-brand-dark">{report.value}</p>
                  </div>
                </article>
              ))}
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
                      <p className="text-sm text-fog">{building.units} units • {building.occupancy}</p>
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
        </div>
      </section>
    </div>
  );
}
