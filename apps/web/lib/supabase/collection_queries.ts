import { createClient } from "./server";

export type CollectionRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  copyright_notice: string;
  sources: { name: string; url: string }[];
  collection_books: { book_id: string }[];
};

export async function getCollections(): Promise<CollectionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select(`
      *,
      collection_books (
        book_id
      )
    `)
    .order("created_at");

  if (error) {
    console.error("Error fetching collections:", error);
    return [];
  }

  return data;
}
