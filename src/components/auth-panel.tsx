"use client";

import { FormEvent, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"tenant" | "owner" | "staff">("tenant");
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
      setMessage(error ? error.message : "Signed in. You can now move into your assigned dashboard.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });

    setMessage(
      error
        ? error.message
        : "Your account request is submitted. The owner or admin will approve access and issue the first lease or team login."
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="light-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Access portal</p>
        <h1 className="font-display mt-3 text-4xl font-bold tracking-[-0.04em] text-emerald-900 md:text-5xl">
          Sign in, request access, or join the right role.
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Tenant sign-up begins with property selection and approval. Owner signup begins with the subscription and then team invitation. Staff and admin access are granted from the owner portal.
        </p>
      </div>

      <div className="glass-panel gradient-stroke rounded-[2.5rem] p-8 md:p-10 text-white">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-emerald-500 text-white" : "border border-white/20 bg-white/10 text-white/80"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-emerald-500 text-white" : "border border-white/20 bg-white/10 text-white/80"}`}
          >
            Request access
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          {mode === "signup" ? (
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white/80">Choose your role</label>
              <div className="flex flex-wrap gap-2">
                {(["tenant", "owner", "staff"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${role === value ? "bg-white text-emerald-900" : "border border-white/20 bg-white/10 text-white/80"}`}
                  >
                    {value === "tenant" ? "Tenant" : value === "owner" ? "Owner" : "Staff"}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "signup" ? (
            <input name="fullName" placeholder="Full name" className="rounded-[1rem] border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60" />
          ) : null}
          <input name="email" type="email" placeholder="Email address" className="rounded-[1rem] border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60" />
          <input name="password" type="password" placeholder="Password" className="rounded-[1rem] border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60" />
          <button className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition">
            {mode === "login" ? "Login" : "Submit request"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-white/80">{message}</p> : null}
      </div>
    </section>
  );
}
