import Link from "next/link";
import { NarratorShell } from "@/components/NarratorShell";
import { createClient } from "@/lib/supabase/server";

export default async function NarratorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let recentRecordings: any[] = [];
  let totalCount = 0;
  if (user) {
    const { data, count } = await supabase
      .from("recordings")
      .select("*, books(title_bn)", { count: "exact" })
      .eq("narrator_id", user.id)
      .limit(3);
    recentRecordings = data || [];
    totalCount = count || 0;
  }

  const summary = [
    {label:"মোট আপলোড",value:totalCount.toString(),note:"এই মাসে +0",tone:"text-[var(--sage)]"},
    {label:"পাওয়া ভোট",value:"0",note:"গত মাসের চেয়ে +0%",tone:"text-[var(--sage)]"},
    {label:"লিডারবোর্ড র‍্যাঙ্ক",value:"-",note:"-",tone:"text-[var(--maroon)]"},
  ];

  return <NarratorShell>
  <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8">
   <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
    <div>
     <p className="eyebrow">ন্যারেটর ড্যাশবোর্ড</p>
     <h1 className="serif mt-2 text-4xl font-bold">আপনার কণ্ঠের ঘর</h1>
     <p className="mt-2 text-sm text-[var(--muted)]">স্বাগতম। আপনার গল্পগুলো এক জায়গায়।</p>
    </div>
    <Link href="/narrator/upload" className="rounded-xl bg-[var(--maroon)] px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-[var(--maroon)]/15">+ নতুন আপলোড</Link>
   </div>

   <div className="mt-8 grid gap-3 sm:grid-cols-3">
    {summary.map((item) => <div key={item.label} className="rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-5">
     <p className="text-xs font-bold text-[var(--muted)]">{item.label}</p>
     <p className="serif mt-2 text-3xl font-bold">{item.value}</p>
     <p className={`mt-1 text-[11px] ${item.tone}`}>{item.note}</p>
    </div>)}
   </div>

   <section className="mt-12 max-w-3xl">
    <div className="flex items-end justify-between">
     <div>
      <p className="eyebrow">আপনার কাজ</p>
      <h2 className="serif mt-2 text-2xl font-bold">সাম্প্রতিক আপলোড</h2>
     </div>
     <Link href="/narrator/stats" className="text-xs font-bold text-[var(--maroon)]">বিস্তারিত stats →</Link>
    </div>
    <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--cream)]">
     {recentRecordings.map((item) => {
       const statusBn = item.status === "approved" ? "অনুমোদিত" : item.status === "rejected" ? "বাতিল" : "পর্যালোচনাধীন";
       const statusTone = item.status === "approved" ? "status-green" : item.status === "rejected" ? "status-red" : "status-amber";
       
       return <div key={item.id} className="flex items-center gap-3 border-b border-[var(--line)] p-4 last:border-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ead6bf] text-[10px] font-bold text-[var(--maroon)]">অডিও</div>
      <div className="min-w-0 flex-1">
       <p className="truncate text-sm font-bold">{item.books?.title_bn || "অজানা বই"}</p>
       <p className="mt-1 text-[11px] text-[var(--muted)]">Status: {item.status}</p>
      </div>
      <span className={`status ${statusTone}`}>{statusBn}</span>
     </div>
     })}
     {recentRecordings.length === 0 && <p className="p-5 text-sm text-[var(--muted)]">এখনো কোনো রেকর্ডিং আপলোড করা হয়নি।</p>}
    </div>
   </section>
  </div>
 </NarratorShell>;
}
