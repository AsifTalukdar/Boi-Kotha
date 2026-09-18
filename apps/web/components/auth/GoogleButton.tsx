"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  }

  return <div><button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full rounded-xl border border-[var(--line)] bg-white py-3 text-sm font-bold disabled:opacity-60">G&nbsp;&nbsp; {loading ? "Connecting..." : "Google দিয়ে চালিয়ে যান"}</button>{error && <p className="mt-2 text-xs text-red-700">{error}</p>}</div>;
}
