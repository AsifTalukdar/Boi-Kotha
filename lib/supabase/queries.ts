import { createClient } from "./server";
import { Book } from "../data";
import { formatDurationLong } from "../format";

export type RecordingRow = {
  id: string;
  book_id: string;
  narrator_id: string;
  storage_path: string | null;
  duration_seconds: number | null;
  status: "pending" | "approved" | "rejected";
  narrator: { display_name: string | null } | null;
};

export type BookWithRecordings = Book & { recordings: RecordingRow[] };

const recordingsSelect = `
  id,
  book_id,
  narrator_id,
  storage_path,
  duration_seconds,
  status,
  narrator:profiles!recordings_narrator_id_fkey ( display_name )
`;

// Lighter version for list views to avoid over-fetching
const listRecordingsSelect = `
  id,
  duration_seconds,
  status,
  narrator:profiles!recordings_narrator_id_fkey ( display_name )
`;

function mapBook(row: any): BookWithRecordings {
  const genre = row.genres && row.genres.length > 0 ? row.genres[0].name_bn : "অজানা";
  const recordings: RecordingRow[] = row.recordings || [];

  // Prefer an approved recording for the card/hero display; fall back to whatever is visible.
  const defaultRec = recordings.find((recording) => recording.status === "approved") ?? recordings[0] ?? null;

  return {
    id: row.id, // The ID from DB, which is a UUID
    title: row.title_bn,
    author: row.author_bn,
    description: row.description_bn,
    cover: row.cover_color,
    accent: "", // Or provide a fallback if needed
    genre: genre,
    duration: defaultRec ? formatDurationLong(defaultRec.duration_seconds) : "কোনো অডিও নেই",
    narrator: defaultRec?.narrator?.display_name ?? "কেউ নেই",
    recordings: recordings,
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
        ${listRecordingsSelect}
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
        ${listRecordingsSelect}
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
        ${recordingsSelect}
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

export type UploadableBook = { id: string; title: string; author: string };

/** Lightweight book list for the narrator upload picker (no recordings join needed). */
export async function getBooksForUpload(): Promise<UploadableBook[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("id,title_bn,author_bn")
    .order("title_bn");

  if (error) {
    console.error("Error fetching books for upload:", error);
    return [];
  }

  return data.map((row) => ({ id: row.id, title: row.title_bn, author: row.author_bn }));
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