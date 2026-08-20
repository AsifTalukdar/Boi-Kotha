import { getAdminCollections, getAdminBookPicks } from "@/lib/supabase/admin_queries";
import { CollectionsAdmin } from "@/components/admin/CollectionsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const [collections, allBooks] = await Promise.all([
    getAdminCollections(),
    getAdminBookPicks(),
  ]);

  return <CollectionsAdmin collections={collections} allBooks={allBooks} />;
}
