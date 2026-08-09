import {notFound} from "next/navigation";
import {BookCard} from "@/components/BookCard";
import { getBooksByGenre, getGenres } from "@/lib/supabase/queries";

export default async function GenrePage({params}:{params:Promise<{id:string}>}){const{id}=await params;const genres = await getGenres();const genre=genres.find(item=>item.slug===id);if(!genre)notFound();const matching=await getBooksByGenre(id);return <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12"><p className="eyebrow">বিষয় অনুযায়ী শুনুন</p><h1 className="serif mt-2 text-4xl font-bold">{genre.name_bn}</h1><p className="mt-3 text-sm text-[var(--muted)]">এই ধারার {matching.length}টি নির্বাচিত অডিওবুক।</p><div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">{matching.map(book=><BookCard key={book.id} book={book}/>)}</div></div>}
