import { getBooks } from "@/lib/supabase/queries";
import { SearchClient } from "./SearchClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const books = await getBooks();
  return (
    <Suspense fallback={<div className="p-8 text-center">লোড হচ্ছে...</div>}>
      <SearchClient books={books} />
    </Suspense>
  );
}
