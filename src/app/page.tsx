import Link from "next/link";
import { AccessMatrix } from "@/components/access-matrix";
import { DoorPortal } from "@/components/door-portal";

const highlights = [
  "Every tenant gets a clean payment path with the right action shown at the right time.",
  "Every bank-deposit tenant gets a unique payment reference for clean reconciliation.",
  "Every owner gets direct visibility into collections, approvals, and controlled payouts.",
  "Every admin gets full-system control with auditability, override power, and role governance."
];

const launchTracks = [
  {
    title: "Tenant onboarding",
    detail: "Collect identity, statements, debit consent, and payment preference without confusing the tenant."
  },
  {
    title: "Owner team access",
    detail: "Owners can invite team members and define what they can view, approve, edit, or manage."
  },
  {
    title: "Admin control",
    detail: "Administrators can see everything, control roles, enforce policy, and resolve edge cases fast."
  }
];

const performancePoints = [
  "Consistent across phones, laptops, and large office screens.",
  "Built for live buildings, not pitch decks.",
  "Every screen now speaks directly to the user in it."
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke relative overflow-hidden rounded-[2.5rem] p-8 md:p-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(53,224,255,0.12),transparent_62%)]" />
          <div className="relative max-w-4xl">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-mist">
              Live product experience
            </p>
            <h1 className="font-display mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
              Property management that actually works for tenants, owners, and operators.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-fog md:text-xl">
              PropertyPro is designed around day-to-day decisions: paying rent, onboarding tenants, approving spend,
              reconciling deposits, and running buildings without losing control or clarity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(91,140,255,0.38)] transition hover:bg-brand-dark"
              >
                Start onboarding
              </Link>
              <Link
                href="/admin/overview"
                className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore the control room
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {performancePoints.map((point) => (
                <article key={point} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-mist">
                  {point}
                </article>
              ))}
            </div>
          </div>
        </div>

        <DoorPortal />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <article
            key={item}
            className="glass-panel gradient-stroke rounded-[2rem] p-6 text-base leading-8 text-white/88"
          >
            {item}
          </article>
        ))}
      </section>

      <section className="light-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Launch tracks</p>
            <h2 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink md:text-5xl">
              Structured around live users, not generic dashboards.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Each entry point is tuned for the person using it. Tenants need trust and simplicity. Owners need control.
              Admins need full power and clean oversight.
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
              href="/owner/dashboard"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
            >
              Owner command view
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {launchTracks.map((track) => (
            <article key={track.title} className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">{track.title}</p>
              <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">{track.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{track.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <AccessMatrix />
    </main>
  );
}
