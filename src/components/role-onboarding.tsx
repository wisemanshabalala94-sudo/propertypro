interface ChecklistItem {
  title: string;
  description: string;
}

interface RoleOnboardingProps {
  role: "tenant" | "owner" | "admin";
  title: string;
  summary: string;
  requirements: ChecklistItem[];
  aiSupport: string[];
}

export function RoleOnboarding({
  role,
  title,
  summary,
  requirements,
  aiSupport
}: RoleOnboardingProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-panel backdrop-blur md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">{role} onboarding</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-4 text-base leading-8 text-slate-700">{summary}</p>
        </div>
        <div className="rounded-3xl bg-ink px-5 py-4 text-sm text-slate-100">
          <p className="font-semibold uppercase tracking-[0.16em] text-brand-soft">AI support</p>
          <ul className="mt-3 space-y-2">
            {aiSupport.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {requirements.map((item, index) => (
          <article key={item.title} className="rounded-3xl border border-slate-200 bg-sand p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Step {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

