"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function approveRecording(id: string) {
  const supabase = await createClient();
  await supabase.from("recordings").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin");
}

export async function rejectRecording(id: string) {
  const supabase = await createClient();
  await supabase.from("recordings").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin");
}

export async function deleteRecording(id: string) {
  const supabase = await createClient();

  // Fetch the storage path first so we can remove the file
  const { data } = await supabase
    .from("recordings")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (data?.storage_path) {
    await supabase.storage.from("recordings").remove([data.storage_path]);
  }

  await supabase.from("recordings").delete().eq("id", id);
  revalidatePath("/admin");
  return { error: null };
}
