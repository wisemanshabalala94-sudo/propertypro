"use client";

import { FormEvent, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "");

    const supabase = getBrowserSupabaseClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? error.message : "Signed in. You can now move into your assigned workspace.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    setMessage(error ? error.message : "Sign-up submitted. Verify your email, then wait for the property owner or admin to assign access.");
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Email access</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
          Login for owners, admins, staff, and tenants.
        </h1>
        <p className="mt-4 text-base leading-8 text-fog">
          The owner account controls the building. Admins and staff get credentials assigned by the owner. Tenants sign up under the correct property and then receive access after review.
        </p>
      </div>

      <div className="light-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
        <div className="flex gap-3">
          <button onClick={() => setMode("login")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-panel text-white" : "border border-slate-200 bg-white text-slate-700"}`}>Login</button>
          <button onClick={() => setMode("signup")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-panel text-white" : "border border-slate-200 bg-white text-slate-700"}`}>Sign up</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
          {mode === "signup" ? (
            <input name="fullName" placeholder="Full name" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
          ) : null}
          <input name="email" type="email" placeholder="Email address" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
          <input name="password" type="password" placeholder="Password" className="rounded-[1rem] border border-slate-200 px-4 py-3 text-sm text-slate-900" />
          <button className="rounded-full bg-panel px-5 py-3 text-sm font-semibold text-white">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </div>
    </section>
  );
}
