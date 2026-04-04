import { TenantWorkspace } from "@/components/tenant-workspace";
import { DashboardFrame } from "@/components/dashboard-frame";
import { getTenantDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function TenantDashboardPage() {
  const data = await getTenantDashboardData();
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col px-4 py-6 md:px-6">
      <DashboardFrame
        role="tenant"
        title="Tenant Dashboard"
        subtitle="Rent, payment reference, maintenance, documents, and messages in one place."
      >
        <TenantWorkspace data={data} />
      </DashboardFrame>
    </main>
  );
}
