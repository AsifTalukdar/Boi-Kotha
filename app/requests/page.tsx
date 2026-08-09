import { getRequests } from "@/lib/supabase/request_queries";
import { RequestsClient } from "./RequestsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await getRequests();

  return (
    <Suspense fallback={<div className="p-8 text-center">লোড হচ্ছে...</div>}>
      <RequestsClient initialRequests={requests} />
    </Suspense>
  );
}
