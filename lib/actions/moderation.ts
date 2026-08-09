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
