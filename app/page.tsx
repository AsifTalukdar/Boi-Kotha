import Link from "next/link";
import {BookCard} from "@/components/BookCard";
import { getBooks, getGenres } from "@/lib/supabase/queries";

export default async function HomePage(){
  const books = await getBooks();
  const genreOptions = await getGenres();

  // Send the hero CTA to a real, playable book (prefer one that has a recording);
  // fall back to the collections browse page when the library is empty.
  const featured = books.find((book) => book.recordings.length > 0) ?? books[0];
  const heroHref = featured ? `/books/${featured.id}` : "/collections";

  return <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12"><section className="relative overflow-hidden rounded-[28px] bg-[#4d2829] px-6 py-10 text-[#fff8ef] sm:px-10 sm:py-14"><div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-[#dba465]/20"/><div className="relative max-w-xl"><p className="eyebrow text-[#e6a35b]">আজকের শোনার তালিকা</p><h1 className="serif mt-3 text-4xl font-bold leading-[1.08] sm:text-5xl">একটি ভালো গল্প,<br/><span className="text-[#e9b476]">একটু নিজের জন্য।</span></h1><p className="mt-5 max-w-md text-sm leading-7 text-[#f4dac3]/80">বাংলা গল্প, কবিতা আর উপন্যাস — আপনার পছন্দের কণ্ঠে, আপনার নিজের গতিতে।</p><Link href={heroHref} className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#e6a35b] px-5 py-3 text-sm font-bold text-[#4d2829]">শোনা শুরু করুন →</Link></div></section><div className="mt-10 flex items-end justify-between"><div><p className="eyebrow">আপনার জন্য বাছাই</p><h2 className="serif mt-2 text-3xl font-bold">আবার শুনুন</h2></div><Link href="/collections" className="text-xs font-bold text-[var(--maroon)]">সব দেখুন →</Link></div><div className="hide-scrollbar mt-5 flex gap-5 overflow-x-auto pb-2">{books.slice(0,4).map(book=><BookCard key={book.id} book={book}/>)}</div>{genreOptions.map(genre=><section key={genre.id} className="mt-12"><div className="flex items-end justify-between"><div><p className="eyebrow">বিষয় অনুযায়ী</p><h2 className="serif mt-2 text-2xl font-bold">{genre.name_bn}</h2></div><Link href={`/genre/${genre.slug}`} className="text-xs font-bold text-[var(--maroon)]">সব দেখুন →</Link></div><div className="hide-scrollbar mt-5 flex gap-5 overflow-x-auto pb-2">{books.filter(book=>book.genre===genre.name_bn).map(book=><BookCard key={book.id} book={book}/>)}</div></section>)}</div>
}
