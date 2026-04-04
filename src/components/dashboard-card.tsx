export function DashboardCard({
  title,
  value,
  detail
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}
