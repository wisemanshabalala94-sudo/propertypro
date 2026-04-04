import { AdminWorkspace } from "@/components/admin-workspace";
import { DashboardFrame } from "@/components/dashboard-frame";
import { getAdminDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminDashboardData();
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col px-4 py-6 md:px-6">
      <DashboardFrame
        role="admin"
        title="Admin Dashboard"
        subtitle="Onboarding, leasing, operations, collections, and communication for each building."
      >
        <AdminWorkspace data={data} />
      </DashboardFrame>
    </main>
  );
}
