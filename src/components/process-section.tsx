"use client";

export function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Get Started",
      description: "Owners create an account, set up their property profile, define lease terms, and invite team members."
    },
    {
      number: "02",
      title: "Find & Onboard Tenants",
      description: "Tenants search for properties, apply, submit documents, and complete affordability verification in minutes."
    },
    {
      number: "03",
      title: "Admin Review & Approval",
      description: "Your admin team reviews applications, AI-powered affordability scores guide decisions, and approvals are one-click."
    },
    {
      number: "04",
      title: "Digital Lease Signing",
      description: "Lease agreements are prepared, customized, and signed digitally by both owner and tenant with full audit trails."
    },
    {
      number: "05",
      title: "Rent Collection",
      description: "Automated payment reminders, multiple payment methods, and instant deposit notifications keep cash flow flowing."
    },
    {
      number: "06",
      title: "Financial Intelligence",
      description: "Bank reconciliation happens automatically. Real-time dashboards show income, expenses, and property profitability."
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full px-4 py-2 bg-gradient-to-r from-emerald-100 to-cyan-100 text-sm font-semibold text-emerald-900 mb-4">
            The journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Your complete property management journey</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From the moment a tenant applies to your final financial report, PropertyPro guides you through every step.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Connection lines (desktop only) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-blue-300 to-cyan-300 opacity-30" style={{width: 'calc(100% - 60px)', marginLeft: '30px'}} />
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connector dot */}
              <div className="absolute -top-8 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm z-10 hidden lg:flex">
                {String(idx + 1)}
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-8 h-full hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <span className="block lg:hidden text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 min-w-fit">{step.number}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
