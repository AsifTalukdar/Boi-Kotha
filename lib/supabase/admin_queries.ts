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
      genres ( id, name_bn ),
      recordings ( id )
    `)
    .order("title_bn");

  if (error) {
    console.error("Error fetching admin books:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title_bn: row.title_bn,
    author_bn: row.author_bn,
    description_bn: row.description_bn,
    cover_color: row.cover_color,
    genre_id: row.genres?.[0]?.id ?? null,
    genre_name: row.genres?.[0]?.name_bn ?? null,
    recording_count: Array.isArray(row.recordings) ? row.recordings.length : 0,
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
