import { OwnerWorkspace } from "@/components/owner-workspace";

export default function OwnerDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <OwnerWorkspace />
    </main>
  );
}
