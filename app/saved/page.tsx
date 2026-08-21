import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth/profile";
import { getFavoriteBooks } from "@/lib/supabase/queries";
import { BookCard } from "@/components/BookCard";

export default async function SavedPage() {
  const current = await getCurrentUserProfile();
  if (!current) redirect("/login?next=/saved");

  const books = await getFavoriteBooks();

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
      <p className="eyebrow">আপনার সংগ্রহ</p>
      <h1 className="serif mt-2 text-4xl font-bold">প্রিয় বই</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">আপনার পছন্দে রাখা {books.length}টি অডিওবুক।</p>
      {books.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--muted)]">এখনো কোনো বই পছন্দে যোগ করেননি। যেকোনো বইয়ের কার্ডে হার্ট আইকনে চাপ দিয়ে প্রিয় বই যোগ করুন।</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} favorited />
          ))}
        </div>
      )}
    </div>
  );
}
