"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function incrementVote(id: string) {
  const supabase = await createClient();
  
  // Call an RPC if we had one for atomic increment, but since this is simple
  // we can just fetch and update, OR use Postgres function. 
  // Let's just do a simple read/write for now, or just trust the client optimism.
  // Wait, Supabase allows atomic increments via RPC. Let's do a direct query using postgres if possible.
  // We can't do direct arithmetic in standard update. We'll read and increment.
  
  const { data } = await supabase.from("requests").select("votes").eq("id", id).single();
  if (data) {
    await supabase.from("requests").update({ votes: data.votes + 1 }).eq("id", id);
    revalidatePath("/requests");
  }
}

export async function addRequest(title: string, category: string) {
  const supabase = await createClient();
  
  await supabase.from("requests").insert({
    title,
    category
  });
  
  revalidatePath("/requests");
}
