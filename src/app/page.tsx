import Link from "next/link";
import { AccessMatrix } from "@/components/access-matrix";
import { DoorPortal } from "@/components/door-portal";
import { PropertySignupHub } from "@/components/property-signup-hub";
import { getPublicPropertyDirectory } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

const highlights = [
  "Every tenant gets a stable payment reference and a clean rent path.",
  "Every owner pays one monthly platform subscription of R1170 for the building account.",
  "Owners invite admins and staff from their own portal, then control each permission scope.",
  "Workers can be paid through the app only after approval rules are satisfied."
];

const ownerFlow = [
  {
    title: "Publish property directory",
    detail: "Owners decide which buildings are visible for self-service sign-up and what notes applicants see."
  },
  {
    title: "Assign the team",
    detail: "Admins, finance staff, building managers, and support workers are invited from the owner portal and get credentials by email."
  },
  {
    title: "Control the money",
    detail: "Incoming transactions notify the owner, approvals gate all outflows, and worker payouts are logged in the same operating system."
  }
];

const performancePoints = [
  "Mobile-first for tenants and field teams.",
  "Built for real buildings and live rent books.",
  "Structured around owner-led operating control."
];

export default async function HomePage() {
  const properties = await getPublicPropertyDirectory();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke relative overflow-hidden rounded-[2.5rem] p-8 md:p-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(53,224,255,0.12),transparent_62%)]" />
          <div className="relative max-w-4xl">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-mist">
              Live property operating system
            </p>
            <h1 className="font-display mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
              The owner controls the building. Everyone else works inside that operating model.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-fog md:text-xl">
              PropertyPro now starts with the property itself. Tenants choose the correct building first, owners pay a single monthly subscription,
              and the owner portal assigns admins, staff, worker payments, and finance permissions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/owner/dashboard"
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(91,140,255,0.38)] transition hover:bg-brand-dark"
              >
                Open owner portal
              </Link>
              <Link
                href="/onboarding"
                className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Preview onboarding
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

      <PropertySignupHub properties={properties} />

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
          {ownerFlow.map((track) => (
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
