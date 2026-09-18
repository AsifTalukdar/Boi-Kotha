import Link from "next/link";
import { NarratorShell } from "@/components/NarratorShell";
import { narratorLeaderboard, narratorPlayTrend, narratorUploads } from "@/lib/data";

const labels = ["সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি", "রবি", "আজ"];

export default function NarratorStatsPage() {
 return <NarratorShell>
  <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8">
   <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
     <Link href="/narrator" className="inline-flex text-xs font-bold text-[var(--muted)]">← ড্যাশবোর্ডে ফিরুন</Link>
     <p className="eyebrow mt-7">পারফরম্যান্স</p>
     <h1 className="serif mt-2 text-4xl font-bold">আপনার কণ্ঠের প্রভাব</h1>
     <p className="mt-2 text-sm text-[var(--muted)]">শেষ ৮ দিনের plays, votes এবং community position।</p>
    </div>
    <div className="rounded-xl border border-[var(--line)] bg-[var(--cream)] px-4 py-3 text-xs font-bold text-[var(--muted)]">শেষ ৮ দিন ▾</div>
   </div>

   <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.85fr]">
    <section className="rounded-3xl border border-[var(--line)] bg-[var(--cream)] p-5 sm:p-7">
     <div className="flex items-start justify-between"><div><p className="text-sm font-bold">দৈনিক plays</p><p className="mt-1 text-xs text-[var(--muted)]">সর্বমোট ৪,৩১২ বার শোনা হয়েছে</p></div><span className="rounded-full bg-[#e4eddf] px-3 py-1 text-[10px] font-bold text-[var(--sage)]">+২৪%</span></div>
     <div className="mt-8 flex h-52 items-end gap-2 sm:gap-4">
      {narratorPlayTrend.map((value, index) => <div key={labels[index]} className="flex flex-1 flex-col items-center gap-3">
       <span className="text-[10px] font-bold text-[var(--muted)]">{value}</span>
       <div className="flex h-36 w-full items-end rounded-t-lg bg-[#f5eadf]">
        <div className={`w-full rounded-t-lg ${index === narratorPlayTrend.length - 1 ? "bg-[var(--maroon)]" : "bg-[#c78358]"}`} style={{height:`${value}%`}} />
       </div>
       <span className="text-[10px] text-[var(--muted)]">{labels[index]}</span>
      </div>)}
     </div>
    </section>

    <section className="rounded-3xl bg-[#4d2829] p-6 text-[#fff8ef]">
     <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#e6a35b]">লিডারবোর্ড</p>
     <p className="serif mt-3 text-4xl font-bold">#০৭</p>
     <p className="mt-2 text-sm leading-6 text-[#f4dac3]/80">এই মাসে আপনি ২ ধাপ এগিয়েছেন। আরও ২৩৮ ভোট পেলে top 5-এ পৌঁছাবেন।</p>
     <Link href="#leaderboard" className="mt-7 inline-flex rounded-xl bg-[#e6a35b] px-4 py-3 text-xs font-bold text-[#4d2829]">পূর্ণ তালিকা দেখুন</Link>
    </section>
   </div>

   <div className="mt-8 grid gap-8 lg:grid-cols-2">
    <section>
     <p className="eyebrow">রেকর্ডিং অনুযায়ী</p>
     <h2 className="serif mt-2 text-2xl font-bold">কোন গল্পে কত ভোট</h2>
     <div className="mt-5 space-y-3">
      {narratorUploads.map((item) => <div key={item.id} className="rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-4">
       <div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold">{item.title}</p><p className="mt-1 text-xs text-[var(--muted)]">{item.plays.toLocaleString("bn-BD")} plays</p></div><span className="text-sm font-bold text-[var(--maroon)]">{item.votes || "—"} ভোট</span></div>
       <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f1e5d8]"><div className="h-full rounded-full bg-[var(--amber)]" style={{width:`${Math.min(100, (item.votes / 150) * 100)}%`}} /></div>
      </div>)}
     </div>
    </section>

    <section id="leaderboard">
     <p className="eyebrow">কমিউনিটি র‍্যাঙ্কিং</p>
     <h2 className="serif mt-2 text-2xl font-bold">সেরা ন্যারেটররা</h2>
     <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--cream)]">
      {narratorLeaderboard.map((entry) => <div key={entry.rank} className={`flex items-center gap-3 border-b border-[var(--line)] p-4 last:border-0 ${entry.isCurrent ? "bg-[#fff5e9]" : ""}`}>
       <span className="w-6 text-center text-xs font-bold text-[var(--muted)]">{entry.rank}</span>
       <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${entry.isCurrent ? "bg-[var(--maroon)] text-white" : "bg-[#ead6bf] text-[var(--maroon)]"}`}>{entry.initials}</span>
       <span className="min-w-0 flex-1 truncate text-sm font-bold">{entry.name}{entry.isCurrent && <span className="ml-2 text-[10px] text-[var(--maroon)]">আপনি</span>}</span>
       <span className="text-xs font-bold text-[var(--muted)]">{entry.votes} ভোট</span>
      </div>)}
     </div>
    </section>
   </div>
  </div>
 </NarratorShell>;
}
