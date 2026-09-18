import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth/profile";
import { UserMenu } from "@/components/layout/UserMenu";
import { AdminSidebar } from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentUserProfile();
  if (!current) redirect("/login?next=/admin");
  if (current.profile.role !== "admin") redirect("/");

  return <div className="min-h-screen bg-[#f6f5f1] text-[#303331]"><AdminSidebar /><div className="min-h-screen md:pl-60"><header className="sticky top-0 z-20 border-b border-[#dedfd9] bg-[#f6f5f1]/95 px-5 py-4 pl-16 backdrop-blur md:px-8"><div className="flex items-center justify-between"><div><p className="hidden text-xs text-[#7d857e] md:block">Admin workspace</p><p className="serif font-bold md:mt-1">অ্যাডমিন প্যানেল</p></div><UserMenu /></div></header><main>{children}</main></div></div>;
}
