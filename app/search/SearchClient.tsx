"use client";

import {useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";
import {BookCard} from "@/components/BookCard";
import {Icon} from "@/components/Icon";
import type { BookWithRecordings } from "@/lib/supabase/queries";

export function SearchClient({ books }: { books: BookWithRecordings[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  useEffect(() => setQuery(params.get("q") || ""), [params]);
  const normalized = query.trim().toLocaleLowerCase();
  const results = normalized ? books.filter(book => `${book.title} ${book.author}`.toLocaleLowerCase().includes(normalized)) : books;
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8">
      <p className="eyebrow">লাইব্রেরি খুঁজুন</p>
      <h1 className="serif mt-2 text-4xl font-bold">কী শুনতে চান?</h1>
      <div className="relative mt-7 max-w-2xl rounded-xl border border-[var(--line)] bg-[var(--cream)]">
        <Icon name="search" size={18} />
        <input autoFocus value={query} onChange={event => setQuery(event.target.value)} className="search-field py-3" placeholder="বই বা লেখকের নাম লিখুন" />
      </div>
      <p className="mt-6 text-sm text-[var(--muted)]">{normalized ? `“${query}” এর জন্য ${results.length}টি ফলাফল` : `সব বই দেখানো হচ্ছে — খুঁজতে শুরু করুন`}</p>
      <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {results.map(book => <BookCard key={book.id} book={book} />)}
      </div>
      {normalized && results.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
          এই নামে কোনো বই বা লেখক পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}
