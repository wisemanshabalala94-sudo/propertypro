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
    <section className="light-panel gradient-stroke rounded-[2.3rem] p-6 md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">{role} onboarding</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink">{title}</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">{summary}</p>
        </div>
        <div className="glass-panel gradient-stroke rounded-[1.8rem] px-5 py-4 text-sm text-slate-100">
          <p className="font-semibold uppercase tracking-[0.16em] text-accent.cyan">AI support</p>
          <ul className="mt-3 space-y-2">
            {aiSupport.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {requirements.map((item, index) => (
          <article key={item.title} className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fog">
              Step {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
