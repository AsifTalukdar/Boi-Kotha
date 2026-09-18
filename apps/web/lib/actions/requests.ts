"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserProfile } from "@/lib/auth/profile";

const ALLOWED_CATEGORIES = ["উপন্যাস", "ছোটগল্প", "কবিতা", "স্মৃতিকথা"];

/**
 * Adjust a request's vote count by `delta` (+1 to vote, -1 to withdraw).
 *
 * Requires an authenticated user (the DB also enforces this via RLS — only the
 * `authenticated` role may UPDATE `requests`). Returns `{ error }` so the client
 * can surface failures instead of silently dropping them.
 *
 * Prefers an atomic DB-side increment via the `vote_request` RPC (see the SQL in
 * the manual-setup notes). If that function isn't installed yet it falls back to
 * a read-then-write, which works today and becomes atomic once the RPC exists.
 */
export async function voteRequest(id: string, delta: number): Promise<{ error: string | null }> {
  const current = await getCurrentUserProfile();
  if (!current) return { error: "not_authenticated" };
  const { supabase } = current;

  const step = delta >= 0 ? 1 : -1;

  const { error: rpcError } = await supabase.rpc("vote_request", { request_id: id, delta: step });
  if (!rpcError) {
    revalidatePath("/requests");
    return { error: null };
  }

  // PGRST202 = the RPC isn't installed. Any other RPC error is a real failure.
  if (rpcError.code && rpcError.code !== "PGRST202") {
    console.error("vote_request RPC failed:", rpcError);
    return { error: "ভোট সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।" };
  }

  // Fallback: non-atomic read-then-write.
  const { data, error: readError } = await supabase.from("requests").select("votes").eq("id", id).single();
  if (readError || !data) return { error: "রিকোয়েস্টটি খুঁজে পাওয়া যায়নি।" };

  const next = Math.max(0, (data.votes ?? 0) + step);
  const { error: writeError } = await supabase.from("requests").update({ votes: next }).eq("id", id);
  if (writeError) {
    console.error("Error updating request votes:", writeError);
    return { error: "ভোট সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।" };
  }

  revalidatePath("/requests");
  return { error: null };
}

export async function addRequest(input: {
  description: string;
  authorBn: string;
  category: string;
}): Promise<{ error: string | null }> {
  const current = await getCurrentUserProfile();
  if (!current) return { error: "not_authenticated" };
  const { supabase, user } = current;

  const description = input.description.trim();
  const authorBn = input.authorBn.trim();
  const category = ALLOWED_CATEGORIES.includes(input.category) ? input.category : ALLOWED_CATEGORIES[0];

  if (!description) return { error: "বইয়ের নাম লিখুন।" };

  const { error } = await supabase.from("requests").insert({
    description,
    author_bn: authorBn || null,
    category,
    user_id: user.id,
  });

  if (error) {
    console.error("Error adding request:", error);
    return { error: "রিকোয়েস্ট যোগ করা যায়নি। আবার চেষ্টা করুন।" };
  }

  revalidatePath("/requests");
  return { error: null };
}
