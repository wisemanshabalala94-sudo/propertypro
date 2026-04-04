import Link from "next/link";

export default function PaymentsCallbackPage({
  searchParams
}: {
  searchParams: {
    reference?: string;
    trxref?: string;
  };
}) {
  const reference = searchParams.reference ?? searchParams.trxref ?? "Pending confirmation";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 md:px-6">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Payment callback</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Payment received, awaiting secure confirmation.</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
          The system is validating your Paystack payment by reference before it is posted to your rent ledger. Do not pay again unless support confirms the payment failed.
        </p>

        <div className="mt-8 rounded-3xl bg-ink p-6 text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-soft">Payment reference</p>
          <p className="mt-3 break-all text-2xl font-semibold">{reference}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tenant/dashboard" className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
            Back to tenant dashboard
          </Link>
          <Link href="/onboarding" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
            View onboarding status
          </Link>
        </div>
      </section>
    </main>
  );
}
