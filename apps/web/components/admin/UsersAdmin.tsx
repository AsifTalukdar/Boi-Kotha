"use client";

import { useState, useTransition, useMemo, useDeferredValue } from "react";
import { updateUserRole, toggleUserSuspension } from "@/lib/actions/admin";
import type { AdminUser } from "@/lib/supabase/admin_queries";

export function UsersAdmin({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    const q = deferredQuery.toLowerCase();
    return users.filter(
      (u) =>
        `${u.display_name || ""} ${u.email}`
          .toLowerCase()
          .includes(q)
    );
  }, [users, deferredQuery]);

  const handleRoleChange = (userId: string, newRole: "listener" | "narrator" | "admin") => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (!res.error) {
        setUsers((current) =>
          current.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    });
  };

  const handleToggleSuspension = (userId: string, currentSuspended: boolean) => {
    const nextSuspended = !currentSuspended;
    startTransition(async () => {
      const res = await toggleUserSuspension(userId, nextSuspended);
      if (!res.error) {
        setUsers((current) =>
          current.map((u) =>
            u.id === userId ? { ...u, suspended: nextSuspended } : u
          )
        );
      }
    });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">
      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87845]">
          অ্যাকাউন্ট
        </p>
        <h1 className="serif mt-2 text-3xl font-bold">ইউজার</h1>
        <p className="mt-2 text-sm text-[#7d857e]">
          ইউজার, ন্যারেটর এবং তাদের অ্যাকাউন্ট স্ট্যাটাস পরিচালনা করুন।
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dedfd9] bg-white">
        <div className="flex gap-3 border-b border-[#dedfd9] p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md rounded-xl border border-[#dedfd9] px-4 py-2 text-sm focus:border-[var(--amber)] focus:outline-none"
            placeholder="নাম বা ইমেইল খুঁজুন…"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-[#fafaf8] text-[10px] font-bold uppercase tracking-wide text-[#929991]">
              <tr>
                <th className="px-5 py-3">নাম</th>
                <th className="px-5 py-3">ইমেইল</th>
                <th className="px-5 py-3">ভূমিকা</th>
                <th className="px-5 py-3">যোগদানের তারিখ</th>
                <th className="px-5 py-3">স্ট্যাটাস</th>
                <th className="px-5 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-[#eee7dd] text-sm">
                  <td className="px-5 py-4 font-bold">
                    {user.display_name || "অজানা ইউজার"}
                  </td>
                  <td className="px-5 py-4 text-[#6f746f]">{user.email}</td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as "listener" | "narrator" | "admin"
                        )
                      }
                      className="rounded-lg border border-[#dedfd9] bg-white px-2 py-1 text-xs font-bold text-[#4d514d]"
                      disabled={isPending}
                    >
                      <option value="listener">listener</option>
                      <option value="narrator">narrator</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-[#6f746f]">
                    {new Date(user.created_at).toLocaleDateString("bn-BD")}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        !user.suspended
                          ? "bg-[#e5eee1] text-[#52704d]"
                          : "bg-[#f5dfd8] text-[#9e5548]"
                      }`}
                    >
                      {!user.suspended ? "সক্রিয়" : "স্থগিত"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleSuspension(user.id, user.suspended)
                      }
                      disabled={isPending}
                      className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold hover:bg-[#f8f4ee]"
                    >
                      {user.suspended ? "সক্রিয় করুন" : "স্থগিত করুন"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <p className="p-8 text-center text-sm text-[#7d857e]">
            কোনো ব্যবহারকারী পাওয়া যায়নি।
          </p>
        )}
      </div>
    </div>
  );
}
