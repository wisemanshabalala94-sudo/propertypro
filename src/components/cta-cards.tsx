"use client";

import Link from "next/link";

export function CTACards() {
  const cards = [
    {
      icon: "🏢",
      title: "Property Owner",
      description: "Manage your entire property portfolio, collect rent, approve tenants, sign leases digitally, and see real-time financial reports.",
      href: "/onboarding?role=owner",
      button: "Start managing",
      benefits: ["Full property control", "Rent collection", "Tenant onboarding", "Digital agreements"]
    },
    {
      icon: "🔑",
      title: "Tenant Onboarding",
      description: "Apply for a property, complete verification in minutes, review and sign your lease digitally, then enjoy automated rent payments.",
      href: "/onboarding?role=tenant",
      button: "Apply as tenant",
      benefits: ["Quick verification", "Digital lease signing", "Easy rent payment", "24/7 support"]
    },
    {
      icon: "👥",
      title: "Admin & Staff Access",
      description: "Property owners assign credentials to team members. Admins review applications, approve tenants, generate reports, and manage disbursements.",
      href: "/auth",
      button: "Get your login",
      benefits: ["Team management", "Application review", "Report generation", "Payout handling"]
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full px-4 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 text-sm font-semibold text-blue-900 mb-4">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Choose your role</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            PropertyPro adapts to your needs. Whether you own properties or rent them, we've got you covered.
          </p>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="group relative rounded-[2rem] overflow-hidden transition-all duration-500"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 group-hover:border-blue-300 transition-all duration-300" />
              
              {/* Floating gradient accent */}
              <div className="absolute -top-full -right-full w-64 h-64 bg-gradient-to-bl from-blue-400/30 via-emerald-400/20 to-transparent rounded-full blur-3xl group-hover:top-0 group-hover:-right-32 transition-all duration-700" />
              
              <div className="relative p-8 md:p-10">
                {/* Icon */}
                <div className="inline-block text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{card.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed mb-8">
                  {card.description}
                </p>

                {/* Benefits list */}
                <ul className="space-y-3 mb-10">
                  {card.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-emerald-500 font-bold mt-1">✓</span>
                      <span className="text-slate-700 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link 
                  href={card.href}
                  className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 group-hover:translate-y-1"
                >
                  {card.button}
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
