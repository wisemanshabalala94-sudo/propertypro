import Link from "next/link";
import { RoleOnboarding } from "@/components/role-onboarding";

const tenantRequirements = [
  {
    title: "Identity and contact details",
    description: "Capture government ID, phone number, next of kin, address history, and consent to store personal data."
  },
  {
    title: "Three months bank statements",
    description: "Upload the latest 3 months of statements so affordability, recurring income, and debit risk can be reviewed."
  },
  {
    title: "Debit authorization",
    description: "Choose whether rent can be debited automatically and accept mandate terms for compliant debit processing."
  },
  {
    title: "Preferred payment channel",
    description: "Select Paystack checkout, bank transfer, ATM deposit, or card debit with a saved collection preference."
  }
];

const ownerRequirements = [
  {
    title: "Property and account setup",
    description: "Register legal entity details, business bank account, and the approval rules for how rental income may be used."
  },
  {
    title: "Approval hierarchy",
    description: "Define who can raise a spending request, who can approve it, and what threshold requires second approval."
  },
  {
    title: "Reporting preferences",
    description: "Set weekly and monthly finance summaries, outstanding rent alerts, and reconciliation exception notifications."
  }
];

const adminRequirements = [
  {
    title: "Portfolio import",
    description: "Load properties, units, leases, current balances, and tenant lists in a controlled onboarding batch."
  },
  {
    title: "Collections rules",
    description: "Set invoice generation timing, grace periods, overdue escalation, and bank import formats."
  },
  {
    title: "Operational controls",
    description: "Enable manual override on reconciliation, approval queues, and savings transfers for Wiseworx administration."
  }
];

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Launch onboarding</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Guided setup for tenants, owners, and property teams.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
          The fastest way to go live this week is to make onboarding structured, self-serve where safe, and staff-assisted
          where money or compliance is at risk. Tenant onboarding carries the deepest checks because it drives collections quality.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tenant/dashboard" className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
            Preview tenant journey
          </Link>
          <Link href="/admin/overview" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
            Preview admin controls
          </Link>
        </div>
      </section>

      <RoleOnboarding
        role="tenant"
        title="Tenant-first onboarding with affordability and debit readiness"
        summary="Tenants should be able to complete onboarding on a phone in minutes, with assisted review behind the scenes. The experience should clearly show what is needed, why it matters, and what happens next."
        requirements={tenantRequirements}
        aiSupport={[
          "Classify uploaded statements and flag missing months automatically.",
          "Summarize affordability signals and repeated bounced debit patterns.",
          "Draft payment reminders in a polite, high-conversion tone."
        ]}
      />

      <RoleOnboarding
        role="owner"
        title="Owner onboarding around approvals, trust, and visibility"
        summary="Owners need confidence that income is ring-fenced, spending is controlled, and financial visibility is immediate. Approval rules are part of onboarding, not a later extra."
        requirements={ownerRequirements}
        aiSupport={[
          "Surface unusual spending or collection dips.",
          "Explain cash position and pending approvals in plain language.",
          "Generate weekly performance summaries per property."
        ]}
      />

      <RoleOnboarding
        role="admin"
        title="Admin onboarding built for operational accuracy"
        summary="Admins need to load the book of business, manage unmatched cash movements, and keep the collection engine healthy without leaving the platform."
        requirements={adminRequirements}
        aiSupport={[
          "Suggest invoice matches for unmatched deposits.",
          "Identify duplicate bank imports before posting.",
          "Prioritize high-risk arrears cases for follow-up."
        ]}
      />
    </main>
  );
}
