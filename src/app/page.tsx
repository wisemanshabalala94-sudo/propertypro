import { PropertySignupHub } from "@/components/property-signup-hub";
import { LandingHero } from "@/components/landing-hero";
import { getPublicPropertyDirectory } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const properties = await getPublicPropertyDirectory();

  return (
    <main className="min-h-screen bg-[#f6fff4] text-slate-900">
      <LandingHero />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <PropertySignupHub properties={properties} />
      </section>
    </main>
  );
}
