"use client";

export function FeaturesSection() {
  const features = [
    {
      icon: "📋",
      title: "Smart Tenant Onboarding",
      description: "Applicants complete verification with ID, bank statements, and address proof. Our AI-powered affordability assessment helps you make confident decisions."
    },
    {
      icon: "✍️",
      title: "Digital Lease Agreements",
      description: "Create, customize, and sign lease agreements entirely within the platform. No paper. No back-and-forth emails. Everything is legally documented."
    },
    {
      icon: "💰",
      title: "Automated Rent Collection",
      description: "Tenants pay rent through their preferred payment method. You get paid directly to your account. No manual chasing, no delays."
    },
    {
      icon: "🔄",
      title: "Bank Reconciliation",
      description: "Upload your bank statements. We automatically match rental payments, receipts, and deposits. See exactly where your money is."
    },
    {
      icon: "📊",
      title: "Financial Reports",
      description: "Real-time dashboards show occupancy, rental income, expenses, and profitability. Export reports for accounting and tax purposes."
    },
    {
      icon: "❤️️",
      title: "Tenant Support",
      description: "Tenants communicate with property management through the app. Maintenance requests, payment issues, and messages are all tracked and prioritized."
    },
    {
      icon: "👥",
      title: "Multi-User Management",
      description: "Invite admins, accountants, and property managers. Control what each team member can see and do with role-based access."
    },
    {
      icon: "🔐",
      title: "Bank-Level Security",
      description: "Your data is encrypted end-to-end. We use industry-standard security practices and comply with all data protection regulations."
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full px-4 py-2 bg-white border border-blue-200 text-sm font-semibold text-blue-900 mb-4">
            Powerful features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Everything you need to succeed</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built with property owners and managers in mind. From tenant verification to financial reconciliation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group relative p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Gradient accent on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              
              <div className="relative">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
