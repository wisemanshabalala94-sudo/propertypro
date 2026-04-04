export function DashboardCard({
  title,
  value,
  detail,
  tone = "light"
}: {
  title: string;
  value: string;
  detail: string;
  tone?: "light" | "dark";
}) {
  const cardClass =
    tone === "dark"
      ? "glass-panel gradient-stroke text-white"
      : "light-panel gradient-stroke text-ink";

  return (
    <article className={`${cardClass} relative overflow-hidden rounded-[1.75rem] p-5`}>
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(53,224,255,0.95),transparent)]" />
      <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${tone === "dark" ? "text-mist" : "text-fog"}`}>
        {title}
      </p>
      <p className="font-display mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className={`mt-2 text-sm leading-6 ${tone === "dark" ? "text-white/72" : "text-slate-600"}`}>{detail}</p>
    </article>
  );
}
