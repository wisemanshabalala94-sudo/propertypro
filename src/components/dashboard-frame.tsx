import Link from "next/link";

const navByRole = {
  owner: [
    { label: "Dashboard", href: "/owner/dashboard" },
    { label: "Properties", href: "/owner/dashboard" },
    { label: "Collections", href: "/owner/dashboard" },
    { label: "Team", href: "/owner/dashboard" },
    { label: "Payouts", href: "/owner/dashboard" }
  ],
  admin: [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Onboarding", href: "/admin/overview" },
    { label: "Leasing", href: "/admin/overview" },
    { label: "Maintenance", href: "/admin/overview" },
    { label: "Communications", href: "/admin/overview" }
  ],
  tenant: [
    { label: "Dashboard", href: "/tenant/dashboard" },
    { label: "Payments", href: "/tenant/dashboard" },
    { label: "Maintenance", href: "/tenant/dashboard" },
    { label: "Documents", href: "/tenant/dashboard" },
    { label: "Messages", href: "/tenant/dashboard" }
  ]
} as const;

export function DashboardFrame({
  role,
  title,
  subtitle,
  children
}: {
  role: "owner" | "admin" | "tenant";
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const navItems = navByRole[role];

  return (
    <div className="dashboard-frame overflow-hidden rounded-[2rem]">
      <div className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="dashboard-sidebar flex flex-col justify-between p-5 text-white">
          <div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
              <p className="font-display text-2xl font-semibold tracking-[-0.03em]">PropertyPro</p>
              <p className="mt-1 text-sm text-white/72">{role} workspace</p>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={`${role}-${item.label}`}
                  href={item.href}
                  className={`block rounded-[1rem] px-4 py-3 text-sm font-medium transition ${index === 0 ? "bg-white/14 text-white" : "text-white/78 hover:bg-white/10 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <Link href="/" className="block rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              Home
            </Link>
            <Link href="/auth" className="block rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              Login
            </Link>
          </div>
        </aside>

        <section className="bg-white">
          <header className="border-b border-slate-200 px-5 py-5 md:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[220px] rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Search PropertyPro
                </div>
              </div>
            </div>
          </header>

          <div className="px-5 py-6 md:px-8">{children}</div>
        </section>
      </div>
    </div>
  );
}
