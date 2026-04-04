import Link from "next/link";
import { InfiniteDoorHero } from "@/components/infinite-door-hero";

const highlights = [
  "Live rent intelligence across buildings, units, and tenants without losing financial control.",
  "Reference-led reconciliation for Paystack, bank transfer, debit orders, and cash deposits.",
  "Approval-first cash governance so operational spending cannot outrun owner authorization.",
  "AI copilots across onboarding, affordability review, arrears prioritization, and anomaly detection."
];

const launchTracks = [
  {
    title: "Tenant onboarding",
    detail: "Collect identity signals, 3 months of bank statements, debit mandates, and payment preference in one elegant flow."
  },
  {
    title: "Owner approvals",
    detail: "Hold disbursements behind approval chains so collections become governable capital, not loose cash."
  },
  {
    title: "AI copilots",
    detail: "Surface risk, missing documents, and collections priorities before teams even open the queue."
  }
];

const performancePoints = [
  "Built to feel premium on both mobile and desktop.",
  "Visual hierarchy designed for property teams under pressure.",
  "A launch surface that looks like a platform, not a prototype."
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel gradient-stroke relative overflow-hidden rounded-[2.5rem] p-8 md:p-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(53,224,255,0.16),transparent_62%)]" />
          <div className="relative max-w-4xl">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-mist">
              The future of African property management
            </p>
            <h1 className="font-display mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
              Finance, access, onboarding, and control in one cinematic operating system.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-fog md:text-xl">
              PropertyPro is designed to make buildings feel alive in software: every tenant, payment, approval,
              deposit, and instruction moving through a single high-trust command layer.
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

        <InfiniteDoorHero />
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
              Built to feel decisive from the first click.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Each entry point is tuned for the person using it: tenants need clarity, owners need confidence, and
              administrators need speed without chaos.
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
    </main>
  );
}
