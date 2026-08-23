"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(bookId: string, isFavorited: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { error } = isFavorited
    ? await supabase.from("favorites").delete().eq("user_id", user.id).eq("book_id", bookId)
    : await supabase.from("favorites").insert({ user_id: user.id, book_id: bookId });

  if (error) {
    console.error("Error toggling favorite:", error);
    return { error: error.message };
  }
  revalidatePath("/saved");
  return { error: null };
<<<<<<< HEAD
}
=======
}
>>>>>>> 2ab7aa76f7999d2438f175506db4e436eba6a695
