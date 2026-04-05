import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/onboarding?role=tenant", label: "Tenant Sign Up" },
  { href: "/onboarding?role=owner", label: "Owner Sign Up" },
  { href: "/auth", label: "Login" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="noise relative min-h-screen overflow-hidden bg-[#f6fff4] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_24%)]" />
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.18),transparent_54%)]" />

      <header className="sticky top-0 z-30 border-b border-emerald-200/40 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <Link href="/" className="font-display text-2xl font-semibold tracking-[-0.03em] text-emerald-900">
              PropertyPro
            </Link>
          </div>
          <nav className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-emerald-200/80 bg-white px-4 py-2 text-sm font-medium text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50"
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
