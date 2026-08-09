import { getBooks } from "@/lib/supabase/queries";
import { getCollections } from "@/lib/supabase/collection_queries";
import { CollectionsClient } from "./CollectionsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const [collections, allBooks] = await Promise.all([
    getCollections(),
    getBooks()
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center">লোড হচ্ছে...</div>}>
      <CollectionsClient collections={collections} allBooks={allBooks} />
    </Suspense>
  );
}
