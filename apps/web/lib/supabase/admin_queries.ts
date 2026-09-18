import { createClient } from "./server";

// ── Books ─────────────────────────────────────────────────────────────

export type AdminBook = {
  id: string;
  title_bn: string;
  author_bn: string | null;
  description_bn: string | null;
  cover_color: string | null;
  genre_id: string | null;
  genre_name: string | null;
  recording_count: number;
  created_at: string;
};

export async function getAdminBooks(): Promise<AdminBook[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select(`
      id,
      title_bn,
      author_bn,
      description_bn,
      cover_color,
      created_at,
      genres ( id, name_bn )
    `)
    .order("title_bn");

  if (error) {
    console.error("Error fetching admin books:", error);
    return [];
  }

  // Fetch recording counts in a single aggregate query instead of
  // pulling all recording IDs into memory via recordings(id).
  const { data: countData } = await supabase
    .from("recordings")
    .select("book_id");

  const countByBook: Record<string, number> = {};
  for (const row of countData || []) {
    countByBook[row.book_id] = (countByBook[row.book_id] || 0) + 1;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title_bn: row.title_bn,
    author_bn: row.author_bn,
    description_bn: row.description_bn,
    cover_color: row.cover_color,
    genre_id: row.genres?.[0]?.id ?? null,
    genre_name: row.genres?.[0]?.name_bn ?? null,
    recording_count: countByBook[row.id] || 0,
    created_at: row.created_at,
  }));
}

// ── Users ─────────────────────────────────────────────────────────────

export type AdminUser = {
  id: string;
  email: string;
  display_name: string | null;
  role: "listener" | "narrator" | "admin";
  avatar_url: string | null;
  suspended: boolean;
  created_at: string;
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name, role, avatar_url, suspended, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    email: row.email,
    display_name: row.display_name,
    role: row.role,
    avatar_url: row.avatar_url,
    suspended: row.suspended ?? false,
    created_at: row.created_at,
  }));
}

// ── Reports ───────────────────────────────────────────────────────────

export type AdminReport = {
  id: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
  recording_title: string | null;
  reporter_name: string | null;
};

export async function getAdminReports(): Promise<AdminReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(`
      id,
      reason,
      status,
      created_at,
      recordings ( books ( title_bn ) ),
      reporter:profiles!reports_reporter_id_fkey ( display_name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin reports:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    reason: row.reason,
    status: row.status,
    created_at: row.created_at,
    recording_title: row.recordings?.books?.title_bn ?? "অজানা রেকর্ডিং",
    reporter_name: row.reporter?.display_name ?? "অজানা",
  }));
}

// ── Genres (for book form dropdown) ───────────────────────────────────

export type GenreOption = { id: string; slug: string; name_bn: string };

export async function getGenreOptions(): Promise<GenreOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("genres")
    .select("id, slug, name_bn")
    .order("name_bn");

  if (error) {
    console.error("Error fetching genre options:", error);
    return [];
  }

  return data || [];
}

// ── Collections ────────────────────────────────────────────────────────

export type AdminCollection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  copyright_notice: string;
  sources: { name: string; url: string }[];
  book_ids: string[];
  book_count: number;
};

export type AdminBookPick = { id: string; title_bn: string; author_bn: string | null };

export async function getAdminCollections(): Promise<AdminCollection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select(`*, collection_books ( book_id )`)
    .order("created_at");

  if (error) {
    console.error("Error fetching admin collections:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    icon: row.icon,
    copyright_notice: row.copyright_notice,
    sources: row.sources || [],
    book_ids: (row.collection_books || []).map((cb: any) => cb.book_id),
    book_count: (row.collection_books || []).length,
  }));
}

export async function getAdminBookPicks(): Promise<AdminBookPick[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("id, title_bn, author_bn")
    .order("title_bn");

  if (error) return [];
  return data || [];
}
