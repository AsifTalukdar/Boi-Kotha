"use client";

import {useState} from "react";
import {Icon} from "@/components/Icon";
import {books} from "@/lib/data";

const genres=["সব ধরণ",...Array.from(new Set(books.map(book=>book.genre)))];

export default function AdminBooksPage(){
 const [query,setQuery]=useState("");
 const [genre,setGenre]=useState("সব ধরণ");
 const shown=books.filter(book=>(genre==="সব ধরণ"||book.genre===genre)&&`${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()));
 return <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8"><div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87845]">ক্যাটালগ</p><h1 className="serif mt-2 text-3xl font-bold">বই</h1><p className="mt-2 text-sm text-[#7d857e]">ক্যাটালগের বই, ন্যারেটর এবং ধরন এক জায়গা থেকে দেখুন।</p></div><div className="overflow-hidden rounded-2xl border border-[#dedfd9] bg-white"><div className="flex flex-col gap-3 border-b border-[#dedfd9] p-4 sm:flex-row"><div className="relative max-w-md flex-1"><Icon name="search" size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} className="search-field" placeholder="বই বা লেখক খুঁজুন"/></div><select value={genre} onChange={event=>setGenre(event.target.value)} className="rounded-lg border border-[#dedfd9] bg-white px-3 py-2 text-sm font-bold text-[#4d514d]"><>{genres.map(item=><option key={item}>{item}</option>)}</></select></div><div className="overflow-x-auto"><table className="min-w-[760px] w-full text-left"><thead className="bg-[#fafaf8] text-[10px] font-bold uppercase tracking-wide text-[#929991]"><tr><th className="px-5 py-3">বই</th><th className="px-5 py-3">লেখক</th><th className="px-5 py-3">ধরণ</th><th className="px-5 py-3">দৈর্ঘ্য</th><th className="px-5 py-3">ন্যারেটর</th><th className="px-5 py-3 text-right">অ্যাকশন</th></tr></thead><tbody>{shown.map(book=><tr key={book.id} className="border-t border-[#eee7dd] text-sm"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="h-9 w-7 rounded-md" style={{backgroundColor:book.cover}}/><span className="font-bold">{book.title}</span></div></td><td className="px-5 py-4 text-[#6f746f]">{book.author}</td><td className="px-5 py-4"><span className="rounded-full bg-[#edf0e8] px-2.5 py-1 text-xs font-bold text-[#5d6b59]">{book.genre}</span></td><td className="px-5 py-4 text-[#6f746f]">{book.duration}</td><td className="px-5 py-4 text-[#6f746f]">{book.narrator}</td><td className="px-5 py-4 text-right"><button type="button" className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold hover:bg-[#f8f4ee]">সম্পাদনা</button></td></tr>)}</tbody></table></div>{shown.length===0&&<p className="p-8 text-center text-sm text-[#7d857e]">কোনো বই পাওয়া যায়নি।</p>}</div></div>;
}
