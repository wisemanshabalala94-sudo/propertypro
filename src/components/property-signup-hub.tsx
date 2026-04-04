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

export function PropertySignupHub({ properties }: { properties: PublicProperty[] }) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id ?? "");
  const [selectedRole, setSelectedRole] = useState<"tenant" | "owner">("tenant");
  const [result, setResult] = useState<string | null>(null);

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId) ?? properties[0] ?? null,
    [properties, selectedPropertyId]
  );

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/property-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: selectedPropertyId,
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

  return (
    <section className="light-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fog">Find your property first</p>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink md:text-5xl">
            Tenants join under the right property before they ever sign up.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            The owner controls who signs in under each building. Choose the property first, then choose the role, then submit the request.
          </p>

          <div className="mt-6 space-y-3">
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => setSelectedPropertyId(property.id)}
                className={`w-full rounded-[1.6rem] border px-4 py-4 text-left transition ${selectedPropertyId === property.id ? "border-brand bg-[#eef5ff]" : "border-slate-200 bg-white"}`}
              >
                <p className="font-display text-xl font-semibold text-ink">{property.name}</p>
                <p className="mt-1 text-sm text-fog">{property.address}</p>
                {property.signupNotes ? <p className="mt-2 text-sm leading-7 text-slate-600">{property.signupNotes}</p> : null}
              </button>
            ))}
            {!properties.length ? (
              <article className="rounded-[1.6rem] border border-slate-200 bg-white p-4 text-sm text-slate-600">
                No public properties are published yet. Owners can enable them from the owner portal.
              </article>
            ) : null}
          </div>
        </div>

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
            <input type="hidden" value={selectedPropertyId} readOnly />
            <input name="applicantName" placeholder="Full name" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
            <input name="applicantEmail" type="email" placeholder="Email address" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
            <input name="applicantPhone" placeholder="Phone number" className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
            <button disabled={!selectedPropertyId} className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              Send sign-up request
            </button>
          </form>

          {result ? <p className="mt-4 text-sm text-fog">{result}</p> : null}

          <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">After request</p>
            <p className="mt-3 text-sm leading-7 text-fog">
              Owners and admins review the request, assign the right credentials, and onboard the user into the correct property environment.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/onboarding${selectedProperty ? `?property=${selectedProperty.slug}&role=${selectedRole}` : ""}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                Preview onboarding path
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
