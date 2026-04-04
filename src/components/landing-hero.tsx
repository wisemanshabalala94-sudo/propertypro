"use client";

import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Animated background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-20 -right-40 w-96 h-96 bg-gradient-to-tl from-cyan-400/15 to-blue-400/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* Main heading */}
        <div className="mb-8 inline-block">
          <span className="inline-block rounded-full px-4 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 text-sm font-semibold text-blue-900 mb-6">
            ✨ The modern property management platform
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
          <span className="block">Rent collection made</span>
          <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">effortless</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 leading-relaxed font-light">
          From tenant onboarding to lease signing to rent collection and financial reconciliation — everything happens right here. Built for property owners who want to manage their buildings with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link 
            href="/onboarding?role=owner"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 blur transition duration-300" />
            <span className="relative">Get started as property owner</span>
          </Link>
          
          <Link 
            href="/onboarding?role=tenant"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-slate-300 text-slate-900 font-semibold text-lg hover:bg-slate-50 transition-all duration-300"
          >
            I'm a tenant
          </Link>

          <Link 
            href="/auth"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 transition-all duration-300"
          >
            Existing login
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-slate-200">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">100%</div>
            <p className="text-sm text-slate-600">Digital agreements</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">Real-time</div>
            <p className="text-sm text-slate-600">Rent reconciliation</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-600 mb-1">Zero</div>
            <p className="text-sm text-slate-600">Hidden fees</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-1">24/7</div>
            <p className="text-sm text-slate-600">Tenant support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
