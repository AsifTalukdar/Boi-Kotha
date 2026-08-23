"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { localizeAuthError } from "@/lib/auth/errors";

export function SignupForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (signUpError || !data.user) {
      setError(localizeAuthError(signUpError?.message ?? "Could not create your account."));
      setLoading(false);
      return;
    }

    if (data.session) {
      const { error: profileError } = await supabase.from("profiles").insert({ id: data.user.id, email, display_name: displayName || null, role: "listener" });
      if (profileError && profileError.code !== "23505") {
        setError(localizeAuthError(profileError.message));
        setLoading(false);
        return;
      }
      router.replace("/");
      router.refresh();
      return;
    }

    setMessage("অ্যাকাউন্ট তৈরি হয়েছে। নিশ্চিত করতে আপনার ইমেইল দেখে নিন।");
    setLoading(false);
  }

  return <form onSubmit={handleSubmit} className="space-y-4"><label className="field-label">আপনার নাম<input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="field mt-2" autoComplete="name" placeholder="আপনার নাম" /></label><label className="field-label">ইমেইল<input required value={email} onChange={(event) => setEmail(event.target.value)} className="field mt-2" type="email" autoComplete="email" placeholder="আপনি@example.com" /></label><label className="field-label">পাসওয়ার্ড<input required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="field mt-2" type="password" autoComplete="new-password" /></label>{error && <p className="text-xs text-red-700">{error}</p>}{message && <p className="text-xs text-[var(--sage)]">{message}</p>}<button disabled={loading} className="w-full rounded-xl bg-[var(--maroon)] py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? "তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}</button></form>;
}
