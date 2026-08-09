import { createClient } from "./server";
import { Book } from "../data";

export type BookWithRecordings = Book & { recordings: any[] };

function mapBook(row: any): BookWithRecordings {
  const genre = row.genres && row.genres.length > 0 ? row.genres[0].name_bn : "অজানা";
  const recordings = row.recordings || [];
  
  // Pick default recording for BookCard display, if any exist
  const defaultRec = recordings.length > 0 ? recordings[0] : null;

  return {
    id: row.id, // The ID from DB, which is a UUID
    title: row.title_bn,
    author: row.author_bn,
    description: row.description_bn,
    cover: row.cover_color,
    accent: "", // Or provide a fallback if needed
    genre: genre,
    duration: defaultRec ? defaultRec.duration_bn || defaultRec.duration || "অজানা" : "কোনো অডিও নেই",
    narrator: defaultRec ? defaultRec.narrator_name_bn || defaultRec.narrator_name || "অজানা" : "কেউ নেই",
    recordings: recordings
  };
}

export async function getBooks(): Promise<BookWithRecordings[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select(`
      *,
      genres (
        slug,
        name_bn
      ),
      recordings (
        *
      )
    `);

  if (error) {
    console.error("Error fetching books from Supabase:", error);
    return [];
  }

  return data.map(mapBook);
}

export async function getBooksByGenre(genreSlug: string): Promise<BookWithRecordings[]> {
  const supabase = await createClient();
  // In Supabase, to filter by a many-to-many joined table, we can use an inner join.
  // Using !inner on the genres relation filters the books to only those that have this genre.
  const { data, error } = await supabase
    .from("books")
    .select(`
      *,
      genres!inner (
        slug,
        name_bn
      ),
      recordings (
        *
      )
    `)
    .eq("genres.slug", genreSlug);

  if (error) {
    console.error("Error fetching books by genre from Supabase:", error);
    return [];
  }

  return data.map(mapBook);
}

export async function getBookById(id: string): Promise<BookWithRecordings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select(`
      *,
      genres (
        slug,
        name_bn
      ),
      recordings (
        *
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching book by id from Supabase:", error);
    return null;
  }

  return data ? mapBook(data) : null;
}

export async function getGenres() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('genres').select('*');
  if (error) {
    console.error("Error fetching genres from Supabase:", error);
    return [];
  }
  return data || [];
}