import { AdminWorkspace } from "@/components/admin-workspace";

export default function AdminOverviewPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <AdminWorkspace />
    </main>
  );
}
