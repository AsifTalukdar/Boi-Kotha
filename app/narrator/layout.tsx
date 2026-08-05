import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth/profile";

export const dynamic = "force-dynamic";

export default async function NarratorLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentUserProfile();
  if (!current) redirect("/login?next=/narrator");
  if (current.profile.role !== "narrator" && current.profile.role !== "admin") redirect("/");
  return children;
}
