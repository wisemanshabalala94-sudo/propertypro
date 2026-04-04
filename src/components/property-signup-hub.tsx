"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type PublicProperty = {
  id: string;
  slug: string;
  name: string;
  address: string;
  signupNotes: string | null;
};

type DemoCredentials = {
  owner: { email: string; password: string; fullName: string };
  admin: { email: string; password: string; fullName: string };
  tenant: { email: string; password: string; fullName: string };
} | null;

export function PropertySignupHub({ properties }: { properties: PublicProperty[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id ?? "");
  const [selectedRole, setSelectedRole] = useState<"tenant" | "owner">("tenant");
  const [result, setResult] = useState<string | null>(null);
  const [demoResult, setDemoResult] = useState<string | null>(null);
  const [demoCredentials, setDemoCredentials] = useState<DemoCredentials>(null);

  const filteredProperties = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return properties;
    }

    return properties.filter((property) => {
      const haystack = `${property.name} ${property.address} ${property.slug}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [properties, searchTerm]);

  const selectedProperty = useMemo(
    () => filteredProperties.find((property) => property.id === selectedPropertyId) ?? filteredProperties[0] ?? properties[0] ?? null,
    [filteredProperties, properties, selectedPropertyId]
  );

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/property-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: selectedProperty?.id ?? selectedPropertyId,
        applicantName: String(formData.get("applicantName") ?? ""),
        applicantEmail: String(formData.get("applicantEmail") ?? ""),
        applicantPhone: String(formData.get("applicantPhone") ?? ""),
        requestedRole: selectedRole
      })
    });

    const payload = await response.json();
    setResult(response.ok ? "Request sent to the property team. Check your email for next steps." : payload.error ?? "Unable to submit request");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  async function createDemoWorkspace() {
    const response = await fetch("/api/demo/setup", { method: "POST" });
    const payload = await response.json();
    if (!response.ok) {
      setDemoResult(payload.error ?? "Unable to create demo workspace");
      return;
    }

    setDemoCredentials(payload.credentials);
    setDemoResult(`Demo workspace ready for ${payload.organization.name} / ${payload.property.name}`);
  }

  return (
    <section className="light-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Find your property first</p>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink md:text-5xl">
            Search the property name before signing up.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Tenants should search by property name, pick the correct building, then continue under that property. Owners control the building environment from their portal.
          </p>

          <div className="mt-6">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search property name or address"
              className="w-full rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="mt-6 space-y-3">
            {filteredProperties.map((property) => (
              <button
                key={property.id}
                onClick={() => setSelectedPropertyId(property.id)}
                className={`w-full rounded-[1.6rem] border px-4 py-4 text-left transition ${selectedProperty?.id === property.id ? "border-brand bg-[#eef5ff]" : "border-slate-200 bg-white"}`}
              >
                <p className="font-display text-xl font-semibold text-ink">{property.name}</p>
                <p className="mt-1 text-sm text-fog">{property.address}</p>
                {property.signupNotes ? <p className="mt-2 text-sm leading-7 text-slate-600">{property.signupNotes}</p> : null}
              </button>
            ))}
            {!filteredProperties.length ? (
              <article className="rounded-[1.6rem] border border-slate-200 bg-white p-4 text-sm text-slate-600">
                No property matched that search. Owners can publish more buildings from the owner portal.
              </article>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel gradient-stroke rounded-[2.2rem] p-6 md:p-8 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Step 1 property, step 2 role, step 3 sign up</p>
            <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">
              {selectedProperty ? `Join ${selectedProperty.name}` : "Join a live property"}
            </h3>

            <div className="mt-5 flex flex-wrap gap-3">
              {(["tenant", "owner"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedRole === role ? "bg-brand text-white" : "border border-white/10 bg-white/5 text-fog"}`}
                >
                  {role === "tenant" ? "Tenant sign up" : "Owner request"}
                </button>
              ))}
            </div>

            <form onSubmit={submitSignup} className="mt-6 grid gap-3">
              <input name="applicantName" placeholder="Full name" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
              <input name="applicantEmail" type="email" placeholder="Email address" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
              <input name="applicantPhone" placeholder="Phone number" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
              <button disabled={!selectedProperty} className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
                Send sign-up request
              </button>
            </form>

            {result ? <p className="mt-4 text-sm text-fog">{result}</p> : null}

            <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">After request</p>
              <p className="mt-3 text-sm leading-7 text-fog">
                Admins handle onboarding, lease agreements, communication, day-to-day operations, and salary processing, but worker payouts only move after owner approval.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/onboarding${selectedProperty ? `?property=${selectedProperty.slug}&role=${selectedRole}` : ""}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                  Preview onboarding path
                </Link>
                <Link href="/auth" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                  Open login
                </Link>
              </div>
            </div>
          </div>

          <div className="glass-panel gradient-stroke rounded-[2.2rem] p-6 md:p-8 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Demo workspace</p>
                <h3 className="font-display mt-2 text-3xl font-semibold tracking-[-0.03em]">Generate test credentials</h3>
              </div>
              <button onClick={createDemoWorkspace} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                Create demo
              </button>
            </div>
            <p className="mt-3 text-sm leading-7 text-fog">
              This creates a test owner, admin, and tenant workspace so you can validate the owner-led operating model end to end.
            </p>
            {demoResult ? <p className="mt-4 text-sm text-fog">{demoResult}</p> : null}

            <div className="mt-5 space-y-3">
              {demoCredentials ? (
                <>
                  <article className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold">Owner</p>
                    <p className="mt-2 text-sm text-fog">{demoCredentials.owner.email}</p>
                    <p className="text-sm text-fog">{demoCredentials.owner.password}</p>
                  </article>
                  <article className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold">Admin</p>
                    <p className="mt-2 text-sm text-fog">{demoCredentials.admin.email}</p>
                    <p className="text-sm text-fog">{demoCredentials.admin.password}</p>
                  </article>
                  <article className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold">Tenant</p>
                    <p className="mt-2 text-sm text-fog">{demoCredentials.tenant.email}</p>
                    <p className="text-sm text-fog">{demoCredentials.tenant.password}</p>
                  </article>
                </>
              ) : (
                <article className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm text-fog">
                  Click “Create demo” and the owner, admin, and tenant credentials will appear here for testing.
                </article>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
