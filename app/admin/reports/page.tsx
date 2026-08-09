import { getAdminReports } from "@/lib/supabase/admin_queries";
import { ReportsAdmin } from "@/components/admin/ReportsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await getAdminReports();

  return <ReportsAdmin initialReports={reports} />;
}
