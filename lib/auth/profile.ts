import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  role: "listener" | "narrator" | "admin";
  avatar_url: string | null;
  created_at: string;
};

const profileColumns = "id,email,display_name,role,avatar_url,created_at";

export async function ensureListenerProfile(supabase: SupabaseClient, user: User) {
  if (!user.email) throw new Error("Authenticated user has no email address.");

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (readError) throw readError;
  if (existing) return existing;

  const metadata = user.user_metadata ?? {};
  const displayName = metadata.display_name ?? metadata.full_name ?? metadata.name ?? user.email.split("@")[0];
  const avatarUrl = metadata.avatar_url ?? metadata.picture ?? null;
  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: user.id, email: user.email, display_name: displayName, avatar_url: avatarUrl, role: "listener" })
    .select(profileColumns)
    .single<Profile>();

  if (!insertError) return created;
  if (insertError.code !== "23505") throw insertError;

  const { data: raced, error: rereadError } = await supabase.from("profiles").select(profileColumns).eq("id", user.id).single<Profile>();
  if (rereadError) throw rereadError;
  return raced;
}

export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await ensureListenerProfile(supabase, user);
  return { supabase, user, profile };
}
