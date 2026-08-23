import { getRequests } from "@/lib/supabase/request_queries";
import { getCurrentUserProfile } from "@/lib/auth/profile";
import { RequestsClient } from "./RequestsClient";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const [requests, current] = await Promise.all([getRequests(), getCurrentUserProfile()]);

  return <RequestsClient initialRequests={requests} isAuthenticated={Boolean(current)} />;
}
