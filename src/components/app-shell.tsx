import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/tenant/dashboard", label: "Tenant" },
  { href: "/owner/dashboard", label: "Owner" },
  { href: "/admin/overview", label: "Admin" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-dark">PropertyPro</p>
            <p className="text-sm text-slate-600">Collection, approvals, and trust accounting for rental income.</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand-dark"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-40 rounded-2xl border border-slate-200 bg-white p-3 shadow-panel">
        <div className="flex items-center gap-3">
          <Image src="/wiseworx-logo.png" alt="Wiseworx" width={132} height={44} className="h-auto w-28" priority />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Owned by Wiseworx</p>
        </div>
      </div>
    </div>
  );
}
