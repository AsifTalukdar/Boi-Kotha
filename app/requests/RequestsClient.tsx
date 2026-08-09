import Link from "next/link";
import {RequestCard} from "@/components/RequestCard";
import { incrementVote } from "@/lib/actions/requests";
import type { RequestRow } from "@/lib/supabase/request_queries";
import { useState } from "react";

function getCategoryColor(category: string) {
  if (category === "উপন্যাস") return { tint: "#ead5bd", icon: "বই" };
  if (category === "কবিতা") return { tint: "#dce0cc", icon: "ক" };
  if (category === "স্মৃতিকথা") return { tint: "#e4c9c2", icon: "স্ম" };
  return { tint: "#d9d7e4", icon: "গল্প" };
}

export function RequestsClient({ initialRequests }: { initialRequests: RequestRow[] }) {
  const [filter, setFilter] = useState("সব রিকোয়েস্ট");
  const filtered = filter === "সব রিকোয়েস্ট" ? initialRequests : initialRequests.filter(r => r.category === filter);

  return <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">কমিউনিটি লাইব্রেরি</p><h1 className="serif mt-2 text-4xl font-bold">রিকোয়েস্ট বোর্ড</h1><p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">যে বই বা বিষয়টি শুনতে চান, তার জন্য ভোট দিন। বেশি ভোট পাওয়া রিকোয়েস্টে আমাদের ন্যারেটররা আগে কাজ করেন।</p></div><button type="button" className="rounded-xl bg-[var(--maroon)] px-4 py-3 text-sm font-bold text-white">+ নতুন রিকোয়েস্ট</button></div><div className="mt-10 flex gap-2 overflow-x-auto"><button type="button" onClick={() => setFilter("সব রিকোয়েস্ট")} className={`rounded-full px-4 py-2 text-xs font-bold ${filter === "সব রিকোয়েস্ট" ? "bg-[var(--maroon)] text-white" : "border border-[var(--line)] text-[var(--muted)]"}`}>সব রিকোয়েস্ট</button><button type="button" onClick={() => setFilter("উপন্যাস")} className={`rounded-full px-4 py-2 text-xs font-bold ${filter === "উপন্যাস" ? "bg-[var(--maroon)] text-white" : "border border-[var(--line)] text-[var(--muted)]"}`}>উপন্যাস</button><button type="button" onClick={() => setFilter("কবিতা")} className={`rounded-full px-4 py-2 text-xs font-bold ${filter === "কবিতা" ? "bg-[var(--maroon)] text-white" : "border border-[var(--line)] text-[var(--muted)]"}`}>কবিতা</button></div><div className="mt-5 space-y-3">{filtered.map(req=>{
    const { tint, icon } = getCategoryColor(req.category);
    const meta = `${req.category} · ${new Date(req.created_at).toLocaleDateString("bn-BD")}`;
    const mapped = { title: req.title, meta, votes: req.votes, tint, icon };
    return <RequestCard key={req.id} request={mapped} onVote={() => { incrementVote(req.id) }}/>
  })}</div><div className="mt-12 rounded-3xl bg-[#ead6bf] p-6 sm:p-8"><p className="eyebrow text-[#8b5b35]">আপনিও ন্যারেটর হতে পারেন</p><h2 className="serif mt-2 text-2xl font-bold">আপনার কণ্ঠে একটি গল্প?</h2><p className="mt-2 text-sm text-[var(--muted)]">ভালোবাসার বইগুলো নতুন করে শোনান।</p><Link href="/narrator" className="mt-4 inline-block rounded-xl bg-white px-4 py-3 text-sm font-bold text-[var(--maroon)]">ন্যারেটর স্টুডিও খুলুন →</Link></div></div>
}
