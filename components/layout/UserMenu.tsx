"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "@/components/auth/LogoutButton";

type UserInfo = { email: string; displayName: string; role: string; avatarUrl: string | null };

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser || !mounted) return;
      const { data: profile } = await supabase.from("profiles").select("display_name,role,avatar_url").eq("id", authUser.id).maybeSingle();
      if (mounted) setUser({ email: authUser.email ?? "", displayName: profile?.display_name ?? authUser.email?.split("@")[0] ?? "User", role: profile?.role ?? "listener", avatarUrl: profile?.avatar_url ?? null });
    }
    loadUser();
    return () => { mounted = false; };
  }, []);

  const initials = (user?.displayName || user?.email || "U").slice(0, 2).toUpperCase();
  return <div className="relative"><button type="button" aria-label="Open user menu" onClick={() => setOpen((value) => !value)} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#b77d63] text-xs font-bold text-white">{user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}</button>{open && <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-3 shadow-xl"><p className="truncate text-sm font-bold">{user?.displayName ?? "Account"}</p><p className="mt-1 truncate text-xs text-[var(--muted)]">{user?.email ?? ""}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{user?.role ?? "listener"}</p><div className="my-3 h-px bg-[var(--line)]" /><LogoutButton onLogout={() => setOpen(false)} /></div>}</div>;
}
