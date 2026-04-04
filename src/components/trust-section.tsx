"use client";

import Link from "next/link";

export function TrustSection() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Trust content */}
          <div>
            <span className="inline-block rounded-full px-4 py-2 bg-white/10 border border-white/20 text-sm font-semibold text-emerald-300 mb-4">
              Why property owners choose us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built by people who understand rental property management
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              PropertyPro was created to solve the real problems property owners face: tenant verification, rent collection delays, complicated paperwork, and financial confusion. We've built something that actually works.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Secure, encrypted, audit-compliant infrastructure",
                "Legal lease agreements recognized in all jurisdictions", 
                "Multi-country support starting with Southern Africa",
                "24/7 customer support for owners and tenants",
                "No long-term contracts. Cancel anytime.",
                "Transparent pricing with no hidden fees"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl mt-1">✓</span>
                  <span className="text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Stats */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-8">
              <div className="text-emerald-400 text-5xl font-bold mb-2">95%</div>
              <p className="text-slate-300 text-lg">of properties see reduced rent collection time</p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-8">
              <div className="text-cyan-400 text-5xl font-bold mb-2">2 hours</div>
              <p className="text-slate-300 text-lg">average tenant onboarding time<br/>(vs 2+ weeks manually)</p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-8">
              <div className="text-blue-400 text-5xl font-bold mb-2">$0</div>
              <p className="text-slate-300 text-lg">setup fees. Start for free.</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-8">
              <p className="text-white text-sm font-semibold mb-3">Ready to transform your property management?</p>
              <Link 
                href="/onboarding?role=owner"
                className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all"
              >
                Start your free trial
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
