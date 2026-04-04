import Link from "next/link";
import { PropertySignupHub } from "@/components/property-signup-hub";
import { getPublicPropertyDirectory } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

const firstActions = [
  {
    title: "Owner sign up",
    detail: "Create the building account, activate the R1170 monthly subscription, publish properties, and assign the team.",
    href: "/onboarding?role=owner"
  },
  {
    title: "Tenant sign up",
    detail: "Search the property name, select the correct building, then complete onboarding and virtual lease steps in-app.",
    href: "/onboarding?role=tenant"
  },
  {
    title: "Staff login",
    detail: "Admins and other roles do not self-register. Owners assign them credentials and permission scopes by email.",
    href: "/auth"
  }
];

const pillars = [
  "Blue-green-white interface tuned for mobile and desktop use.",
  "Tenant onboarding, screening, approvals, leases, and payments handled in-app.",
  "Admins run daily operations, but payouts only move after owner approval.",
  "Each tenant keeps one stable payment reference for deposit and transfer workflows."
];

export default async function HomePage() {
  const properties = await getPublicPropertyDirectory();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="glass-panel gradient-stroke relative overflow-hidden rounded-[2.8rem] p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(52,211,153,0.16),transparent_22%),linear-gradient(135deg,rgba(6,24,44,0.88),rgba(8,52,86,0.75))]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-mist">
              Simple first step
            </p>
            <h1 className="font-display mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
              Sign up owners. Sign up tenants. Give other roles access from the owner portal.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-fog md:text-xl">
              PropertyPro is built for real property operations. Owners create the building account. Tenants sign up under the correct property.
              Admins run onboarding, leases, communication, and daily activity inside the same system.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {firstActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 transition hover:border-[#34d399] hover:bg-white/10"
                >
                  <p className="font-display text-2xl font-semibold text-white">{action.title}</p>
                  <p className="mt-2 text-sm leading-7 text-fog">{action.detail}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="light-panel gradient-stroke rounded-[2.2rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">What the platform handles</p>
            <div className="mt-5 grid gap-4">
              {pillars.map((pillar) => (
                <article key={pillar} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700">
                  {pillar}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PropertySignupHub properties={properties} />

      <section className="light-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Owner-led rollout</p>
            <h2 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink md:text-5xl">
              One subscription, one property structure, one accountable control chain.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              This system is now organized around the building owner as the paying customer. The owner subscribes at R1170 per month,
              staff work under that building account, and all credentials are issued and limited from the owner portal.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tenant/dashboard"
              className="rounded-full bg-panel px-5 py-3 text-sm font-semibold text-white"
            >
              Tenant experience
            </Link>
            <Link
              href="/admin/overview"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
            >
              Admin operations
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Owner portal",
              detail: "Subscription, staff invites, worker payouts, bank accounts, and approval policy all live in one portal."
            },
            {
              title: "Tenant journey",
              detail: "Search property, sign up, complete onboarding, get approved, sign the lease virtually, then pay rent in-app."
            },
            {
              title: "Admin operations",
              detail: "Admins manage onboarding, lease preparation, communication, screening, salaries, and daily building operations."
            }
          ].map((track) => (
            <article key={track.title} className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">{track.title}</p>
              <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">{track.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{track.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
