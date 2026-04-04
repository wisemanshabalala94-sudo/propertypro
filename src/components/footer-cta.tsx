"use client";

import Link from "next/link";

export function FooterCTA() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22><path fill=%22rgba(255,255,255,0.1)%22 d=%22M0,96L120,112C240,128,480,160,720,160C960,160,1200,128,1320,112L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z%22></path></svg>')] bg-cover" />
          
          {/* Content */}
          <div className="relative px-8 md:px-12 py-16 md:py-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to streamline your property business?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light">
              Join property owners who are spending less time on administration and more time growing their portfolio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/onboarding?role=owner"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-slate-100 transition-all duration-300 hover:shadow-xl"
              >
                Start free today
              </Link>
              <Link 
                href="/onboarding?role=tenant"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Apply as tenant
              </Link>
            </div>

            <p className="mt-8 text-white/75 text-sm">
              No credit card required. No setup fees. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
