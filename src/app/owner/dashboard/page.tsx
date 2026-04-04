import { OwnerWorkspace } from "@/components/owner-workspace";
import { getOwnerDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const data = await getOwnerDashboardData();
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <OwnerWorkspace data={data} />
    </main>
  );
}
