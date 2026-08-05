"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return <form onSubmit={handleSubmit} className="space-y-4"><label className="field-label">ইমেইল<input required value={email} onChange={(event) => setEmail(event.target.value)} className="field mt-2" type="email" autoComplete="email" placeholder="আপনি@example.com" /></label><label className="field-label">পাসওয়ার্ড<input required value={password} onChange={(event) => setPassword(event.target.value)} className="field mt-2" type="password" autoComplete="current-password" /></label>{error && <p className="text-xs text-red-700">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-[var(--maroon)] py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? "Logging in..." : "লগ ইন করুন"}</button></form>;
}
