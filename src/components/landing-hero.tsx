"use client";

import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-emerald-700/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-white via-white to-emerald-50" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-full border border-emerald-200 bg-white/90 px-6 py-5 shadow-[0_40px_120px_rgba(16,185,129,0.14)] backdrop-blur-xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-700 text-4xl font-semibold text-white shadow-lg shadow-emerald-700/25">
            PP
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-700">PROPERTYPRO</p>
          <h1 className="mt-6 text-5xl font-black uppercase tracking-[-0.05em] text-slate-900 sm:text-6xl md:text-7xl">
            The property tool built for owners, tenants, and teams.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg md:text-xl">
            One place for tenant building selection, owner subscription onboarding, team access control, and automatic rent tracking with Paystack-ready payment references.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth" className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800">
              Sign in
            </Link>
            <Link href="/onboarding?role=tenant" className="inline-flex items-center justify-center rounded-full border border-emerald-700 bg-white px-8 py-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
              Tenant sign up
            </Link>
            <Link href="/onboarding?role=owner" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Owner sign up
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_35%)]" />
          <div className="absolute inset-x-0 bottom-0 h-full animate-city overflow-hidden">
            <div className="flex h-full w-[220%] gap-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex w-full items-end gap-3">
                  {[80, 120, 64, 104, 48, 96, 56, 88].map((height, index) => (
                    <div
                      key={index}
                      style={{ height: `${height}px` }}
                      className="relative w-10 rounded-t-3xl bg-gradient-to-t from-emerald-700 to-emerald-300 shadow-lg shadow-emerald-700/20"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
