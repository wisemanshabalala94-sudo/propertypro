import Link from "next/link";

const highlights = [
  "Track rent paid, unpaid, and partially settled invoices in one ledger.",
  "Import bank and ATM deposit activity, then reconcile against tenant references.",
  "Require owner approval before income is moved or spent.",
  "Automatically reserve R100 per tenant payment into the Wiseworx savings allocation."
];

const launchTracks = [
  {
    title: "Tenant onboarding",
    detail: "Collect identity details, 3 months of bank statements, debit authorization, and preferred payment method."
  },
  {
    title: "Owner approvals",
    detail: "Hold disbursement requests until owners sign off on use of rental income."
  },
  {
    title: "AI copilots",
    detail: "Prioritize document checks, debt-risk flags, payment reminders, and unmatched bank transaction suggestions."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12">
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-panel backdrop-blur md:p-12">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-dark">
            Production MVP foundation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Finance control for rent, deposits, approvals, and trust.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            This starter implements the backend shape and deployment structure for a property management
            platform focused on collections, reconciliation, and controlled use of rental income.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Start role onboarding
            </Link>
            <Link
              href="/tenant/dashboard"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
            >
              View mobile-friendly dashboards
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-slate-200 bg-sand p-5 text-base leading-7 text-slate-800"
            >
              {item}
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {launchTracks.map((track) => (
            <article key={track.title} className="rounded-3xl bg-ink p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-soft">{track.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{track.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
