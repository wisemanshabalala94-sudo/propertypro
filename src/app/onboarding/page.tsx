import Link from "next/link";
import { RoleOnboarding } from "@/components/role-onboarding";

const tenantRequirements = [
  {
    title: "Choose the correct property first",
    description: "Tenants should scroll the property directory, pick the correct building, then continue with sign-up under that property."
  },
  {
    title: "Identity, email verification, and contact details",
    description: "Capture government ID, verified email, phone number, next of kin, and address history before access is granted."
  },
  {
    title: "Three months bank statements and payment readiness",
    description: "Upload the latest 3 months of statements, choose payment method, and accept debit authorization where applicable."
  },
  {
    title: "Stable payment reference",
    description: "Every tenant gets one consistent property-linked payment reference for bank deposits, EFT, and manual transfers."
  }
];

const ownerRequirements = [
  {
    title: "Monthly owner subscription",
    description: "The owner pays R1170 per month for the building account. Team members under that owner account work within the same subscription."
  },
  {
    title: "Property directory and sign-up control",
    description: "Choose which buildings are visible for public sign-up and define the notes tenants see before requesting access."
  },
  {
    title: "Assign admins and staff from the owner portal",
    description: "Owners create credentials, invite admins and workers by email, and control exactly what each role can do."
  },
  {
    title: "Banking, payouts, and approvals",
    description: "Connect owner bank accounts, configure worker payout paths, and enforce approval rules before money moves."
  }
];

const adminRequirements = [
  {
    title: "Property setup and configuration",
    description: "Admins configure units, leases, account settings, late fee logic, and operational defaults inside the owner-controlled environment."
  },
  {
    title: "Lease agreements and screening",
    description: "Generate lease packs, process tenant screening, and keep the move-in workflow accurate and auditable."
  },
  {
    title: "Bank deposits and reconciliation",
    description: "Record deposits, resolve unmatched transactions, and move exceptions into the right approval lane."
  },
  {
    title: "Maintenance and transaction control",
    description: "Manage maintenance queues, worker payout preparation, and approval workflows within the permissions granted by the owner."
  }
];

export default function OnboardingPage({
  searchParams
}: {
  searchParams?: { property?: string; role?: string };
}) {
  const selectedRole = searchParams?.role ?? "tenant";
  const selectedProperty = searchParams?.property ?? "selected-property";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="glass-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Launch onboarding</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
          Property first, role second, credentials after approval.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-fog">
          The onboarding model now follows the real workflow: choose the property, choose the role, submit the request, then let the owner or admin complete credential assignment and access control.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-mist">Selected property</p>
            <p className="mt-2 font-display text-2xl text-white">{selectedProperty}</p>
          </article>
          <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-mist">Selected role</p>
            <p className="mt-2 font-display text-2xl text-white">{selectedRole}</p>
          </article>
          <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-mist">Control point</p>
            <p className="mt-2 font-display text-2xl text-white">Owner portal</p>
          </article>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
            Back to property directory
          </Link>
          <Link href="/owner/dashboard" className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white">
            Open owner portal
          </Link>
        </div>
      </section>

      <RoleOnboarding
        role="tenant"
        title="Tenant onboarding with property selection, live verification, and one stable payment reference"
        summary="Tenant sign-up starts by choosing the correct building. After that, the tenant submits details, verifies email, uploads documents, and receives a single reference code for deposits and transfer-based rent payments."
        requirements={tenantRequirements}
        aiSupport={[
          "Classify uploaded statements and flag missing months automatically.",
          "Summarize affordability signals and repeated bounced debit patterns.",
          "Draft reminders for upcoming and overdue rent in a calm, useful tone."
        ]}
      />

      <RoleOnboarding
        role="owner"
        title="Owner onboarding around subscription, staff control, and financial authority"
        summary="Owners are the paying account holders. They activate the monthly platform subscription, publish properties, assign admins, define payout permissions, and configure how staff work under the building account."
        requirements={ownerRequirements}
        aiSupport={[
          "Surface unusual spending or collection dips.",
          "Explain cash position and pending approvals in plain language.",
          "Generate weekly owner summaries by property and by arrears pressure."
        ]}
      />

      <RoleOnboarding
        role="admin"
        title="Admin onboarding built for operations inside owner-defined controls"
        summary="Admins do the setup, screening, maintenance coordination, and reconciliation work, but their access comes from the owner portal. That keeps operational power inside a controlled chain."
        requirements={adminRequirements}
        aiSupport={[
          "Suggest invoice matches for unmatched deposits.",
          "Identify duplicate bank imports before posting.",
          "Prioritize high-risk arrears and maintenance cases for follow-up."
        ]}
      />
    </main>
  );
}
