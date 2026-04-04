import { OwnerWorkspace } from "@/components/owner-workspace";
import { DashboardFrame } from "@/components/dashboard-frame";
import { getOwnerDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const data = await getOwnerDashboardData();
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col px-4 py-6 md:px-6">
      <DashboardFrame
        role="owner"
        title="Owner Dashboard"
        subtitle="Portfolio control, approvals, staff access, subscriptions, and payout readiness."
      >
        <OwnerWorkspace data={data} />
      </DashboardFrame>
    </main>
  );
}
