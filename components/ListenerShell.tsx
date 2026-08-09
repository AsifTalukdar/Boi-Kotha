"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { genreOptions, navLinks } from "@/lib/data";
import { UserMenu } from "@/components/layout/UserMenu";
import { Icon } from "./Icon";

export function ListenerShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const submitSearch = (event: React.FormEvent) => { event.preventDefault(); const term = query.trim(); router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search"); };

  return <div className="min-h-screen pb-24"><aside className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-[var(--line)] bg-[#f7efe4] p-6 transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
    <div className="mb-14 flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--maroon)] text-lg text-[#f8d5a5]">ব</span><span className="serif text-lg font-bold">বই কথা</span></Link><button type="button" onClick={() => setMobileOpen(false)} className="md:hidden"><Icon name="close" size={18} /></button></div>
    <div className="eyebrow mb-3">শুনতে থাকুন</div><nav className="space-y-1">{navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${pathname === link.href ? "bg-[var(--maroon)] text-white" : "text-[var(--muted)]"}`}><span className="text-lg">{link.icon}</span>{link.label}</Link>)}<Link href="/collections" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${pathname === "/collections" ? "bg-[var(--maroon)] text-white" : "text-[var(--muted)]"}`}><span className="text-lg">◈</span>সংগ্রহ</Link></nav>
    <div className="mt-10 border-t border-[var(--line)] pt-7"><div className="eyebrow mb-3">আপনার জায়গা</div><Link href="/narrator" className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[var(--muted)]"><span className="text-lg">◌</span>ন্যারেটর স্টুডিও</Link><Link href="/admin" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[var(--muted)]"><span className="text-lg">▫</span>অ্যাডমিন</Link></div>
    <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-[#ead6bf] p-4"><p className="text-xs font-bold">আপনার পরের গল্প কোথায়?</p><p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">শুনে ভালো লাগলে ন্যারেটরকে একটি ভোট দিন।</p></div>
  </aside><header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/90 px-4 py-3 backdrop-blur md:ml-60 md:px-8"><div className="flex items-center gap-3"><button type="button" onClick={() => setMobileOpen(true)} className="md:hidden"><Icon name="menu" size={22} /></button><form onSubmit={submitSearch} className="relative max-w-xl flex-1"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="search-field" placeholder="বই, লেখক বা বিষয় খুঁজুন" /></form><select value={pathname.startsWith("/genre/") ? pathname.split("/").pop() || "" : ""} onChange={(event) => event.target.value && router.push(`/genre/${event.target.value}`)} className="hidden rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-xs font-bold text-[var(--muted)] sm:block"><option value="">সব ধরন</option>{genreOptions.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}</select><UserMenu /></div></header><main className="app-main min-h-screen">{children}</main></div>;
}
