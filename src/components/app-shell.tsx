import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/onboarding?role=owner", label: "Owner Sign Up" },
  { href: "/onboarding?role=tenant", label: "Tenant Sign Up" },
  { href: "/auth", label: "Staff Login" },
  { href: "/owner/dashboard", label: "Owner Portal" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="noise relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:72px_72px] opacity-[0.05]" />
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(91,140,255,0.2),transparent_52%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081423e3] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.34em] text-mist">PropertyPro</p>
            <p className="text-sm text-fog">Owner-led property operations for rent, approvals, onboarding, and cash integrity.</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/88 transition hover:border-brand hover:bg-[#0f2e4d] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-40 rounded-2xl border border-slate-200/60 bg-white p-3 shadow-panel">
        <Image src="/wiseworx-logo.png" alt="Wiseworx" width={132} height={44} className="h-auto w-28" priority />
      </div>
    </div>
  );
}
