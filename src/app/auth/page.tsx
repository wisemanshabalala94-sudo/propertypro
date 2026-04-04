import { AuthPanel } from "@/components/auth-panel";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <AuthPanel />
    </main>
  );
}
