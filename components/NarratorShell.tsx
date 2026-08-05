import Link from "next/link";
import { UserMenu } from "@/components/layout/UserMenu";

export function NarratorShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f7f1e8]"><header className="border-b border-[var(--line)] bg-[var(--cream)] px-5 py-4 sm:px-10"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/narrator" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--maroon)] text-lg text-[#f8d5a5]">অ</span><span className="serif text-lg font-bold">ন্যারেটর স্টুডিও</span></Link><div className="flex items-center gap-3"><Link href="/" className="hidden text-xs font-bold text-[var(--muted)] sm:block">শ্রোতা ভিউ →</Link><UserMenu /></div></div></header>{children}</main>;
}
