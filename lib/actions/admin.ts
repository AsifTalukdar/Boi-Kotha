"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

// ── Books ─────────────────────────────────────────────────────────────

export async function createBook(formData: {
  title_bn: string;
  author_bn: string;
  description_bn: string;
  cover_color: string;
  genre: string | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("books").insert({
    title_bn: formData.title_bn,
    author_bn: formData.author_bn || null,
    description_bn: formData.description_bn || null,
    cover_color: formData.cover_color || "#754338",
  }).select("id").single();

  if (error) {
    console.error("Error creating book:", error);
    return { error: error.message };
  }

  if (formData.genre && data) {
    const { error: genreError } = await supabase.from("book_genres").insert({
      book_id: data.id,
      genre_id: formData.genre,
    });
    if (genreError) console.error("Error setting genre:", genreError);
  }

  revalidatePath("/admin/books");
  revalidatePath("/");
  return { error: null };
}

export async function updateBook(
  id: string,
  formData: {
    title_bn: string;
    author_bn: string;
    description_bn: string;
    cover_color: string;
    genre: string | null;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("books")
    .update({
      title_bn: formData.title_bn,
      author_bn: formData.author_bn || null,
      description_bn: formData.description_bn || null,
      cover_color: formData.cover_color || "#754338",
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating book:", error);
    return { error: error.message };
  }

  // Update genre: delete old and insert new
  await supabase.from("book_genres").delete().eq("book_id", id);
  if (formData.genre) {
    const { error: genreError } = await supabase.from("book_genres").insert({
      book_id: id,
      genre_id: formData.genre,
    });
    if (genreError) console.error("Error setting genre:", genreError);
  }

  revalidatePath("/admin/books");
  revalidatePath("/");
  return { error: null };
}

export async function deleteBook(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) {
    console.error("Error deleting book:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/books");
  revalidatePath("/");
  return { error: null };
}

// ── Users ─────────────────────────────────────────────────────────────

export async function updateUserRole(id: string, role: "listener" | "narrator" | "admin") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);

  if (error) {
    console.error("Error updating user role:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { error: null };
}

export async function toggleUserSuspension(id: string, suspended: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ suspended })
    .eq("id", id);

  if (error) {
    console.error("Error toggling user suspension:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { error: null };
}

// ── Reports ───────────────────────────────────────────────────────────

export async function resolveReport(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({ status: "resolved" })
    .eq("id", id);

  if (error) {
    console.error("Error resolving report:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/reports");
  return { error: null };
}

export async function dismissReport(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({ status: "dismissed" })
    .eq("id", id);

  if (error) {
    console.error("Error dismissing report:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/reports");
  return { error: null };
}

// ── Collections ────────────────────────────────────────────────────────

export async function createCollection(formData: {
  title: string;
  description: string;
  icon: string;
  copyright_notice: string;
  sources: { name: string; url: string }[];
  book_ids: string[];
}) {
  const supabase = await createClient();
  const slug = formData.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);

  const { data, error } = await supabase
    .from("collections")
    .insert({
      slug,
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      copyright_notice: formData.copyright_notice,
      sources: formData.sources,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if (formData.book_ids.length > 0) {
    await supabase.from("collection_books").insert(
      formData.book_ids.map((book_id) => ({ collection_id: data.id, book_id }))
    );
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return { error: null };
}

export async function updateCollection(
  id: string,
  formData: {
    title: string;
    description: string;
    icon: string;
    copyright_notice: string;
    sources: { name: string; url: string }[];
    book_ids: string[];
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("collections")
    .update({
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      copyright_notice: formData.copyright_notice,
      sources: formData.sources,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Replace the book list entirely
  await supabase.from("collection_books").delete().eq("collection_id", id);
  if (formData.book_ids.length > 0) {
    await supabase.from("collection_books").insert(
      formData.book_ids.map((book_id) => ({ collection_id: id, book_id }))
    );
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return { error: null };
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  // collection_books rows cascade via FK in the DB; if not, delete manually
  await supabase.from("collection_books").delete().eq("collection_id", id);
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return { error: null };
}
