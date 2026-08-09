import { getAdminUsers } from "@/lib/supabase/admin_queries";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return <UsersAdmin initialUsers={users} />;
}
