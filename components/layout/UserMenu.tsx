"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "@/components/auth/LogoutButton";

type UserInfo = { email: string; displayName: string; role: string; avatarUrl: string | null };
type Status = "loading" | "authed" | "anon";

// Human-readable Bengali labels for the role badge.
const ROLE_LABEL: Record<string, string> = { listener: "শ্রোতা", narrator: "ন্যারেটর", admin: "অ্যাডমিন" };

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!authUser) {
        setStatus("anon");
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("display_name,role,avatar_url").eq("id", authUser.id).maybeSingle();
      if (!mounted) return;
      setUser({ email: authUser.email ?? "", displayName: profile?.display_name ?? authUser.email?.split("@")[0] ?? "User", role: profile?.role ?? "listener", avatarUrl: profile?.avatar_url ?? null });
      setStatus("authed");
    }
    loadUser();
    return () => { mounted = false; };
  }, []);

  // While auth state is resolving, render a neutral placeholder so we never
  // flash the wrong menu (e.g. "log out" to a visitor who is actually anon).
  if (status === "loading") {
    return <div aria-hidden="true" className="h-9 w-9 rounded-full bg-[#ead6bf]" />;
  }

  // Logged-out: offer the actual entry points instead of a fake account menu.
  if (status === "anon") {
    return (
      <div className="relative">
        <button type="button" aria-label="অ্যাকাউন্ট মেনু" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex h-9 items-center gap-2 rounded-full border border-[var(--line)] px-3 text-xs font-bold text-[var(--muted)]">
          অ্যাকাউন্ট
        </button>
        {open && (
          <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-2 shadow-xl">
            <Link href="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-bold text-[var(--maroon)] hover:bg-[#f3e6d6]">লগ ইন করুন</Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="mt-1 block rounded-lg px-3 py-2 text-sm font-bold text-[var(--ink)] hover:bg-[#f3e6d6]">অ্যাকাউন্ট খুলুন</Link>
          </div>
        )}
      </div>
    );
  }

  const initials = (user?.displayName || user?.email || "U").slice(0, 2).toUpperCase();
  const roleLabel = ROLE_LABEL[user?.role ?? "listener"] ?? (user?.role ?? "listener");
  return <div className="relative"><button type="button" aria-label="ইউজার মেনু" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#b77d63] text-xs font-bold text-white">{user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}</button>{open && <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-3 shadow-xl"><p className="truncate text-sm font-bold">{user?.displayName ?? "অ্যাকাউন্ট"}</p><p className="mt-1 truncate text-xs text-[var(--muted)]">{user?.email ?? ""}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{roleLabel}</p><div className="my-3 h-px bg-[var(--line)]" /><LogoutButton onLogout={() => setOpen(false)} /></div>}</div>;
}
