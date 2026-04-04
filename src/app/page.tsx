import { PropertySignupHub } from "@/components/property-signup-hub";
import { LandingHero } from "@/components/landing-hero";
import { CTACards } from "@/components/cta-cards";
import { FeaturesSection } from "@/components/features-section";
import { ProcessSection } from "@/components/process-section";
import { TrustSection } from "@/components/trust-section";
import { FooterCTA } from "@/components/footer-cta";
import { getPublicPropertyDirectory } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const properties = await getPublicPropertyDirectory();

  return (
    <main className="w-full">
      {/* Hero Section */}
      <div className="bg-white">
        <LandingHero />
      </div>

      {/* CTA Cards - Choose your role */}
      <div className="bg-white">
        <CTACards />
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* Process Timeline */}
      <div className="bg-white">
        <ProcessSection />
      </div>

      {/* Property Search Hub */}
      <div className="px-4 md:px-6 py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <PropertySignupHub properties={properties} />
        </div>
      </div>

      {/* Trust & Credibility */}
      <TrustSection />

      {/* Footer CTA */}
      <FooterCTA />
    </main>
  );
}
