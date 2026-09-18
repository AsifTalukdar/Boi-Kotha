"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  const router = useRouter();

  async function handleLogout() {
    await createClient().auth.signOut();
    onLogout?.();
    window.location.href = "/login";
  }

  return <button type="button" onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-red-700 hover:bg-red-50">লগ আউট</button>;
}
