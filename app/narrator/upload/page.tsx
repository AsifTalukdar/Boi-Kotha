import Link from "next/link";
import { NarratorShell } from "@/components/NarratorShell";
import { UploadStepper } from "@/components/UploadStepper";
import { getBooksForUpload } from "@/lib/supabase/queries";

export default async function NarratorUploadPage() {
 const books = await getBooksForUpload();
 return <NarratorShell>
  <div className="mx-auto max-w-4xl px-5 py-9 sm:px-8">
   <Link href="/narrator" className="inline-flex text-xs font-bold text-[var(--muted)]">← ন্যারেটর ড্যাশবোর্ডে ফিরুন</Link>
   <div className="mt-7 max-w-2xl">
    <p className="eyebrow">নতুন রেকর্ডিং</p>
    <h1 className="serif mt-2 text-4xl font-bold">আপনার কণ্ঠে একটি গল্প</h1>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">প্রতিটি ধাপ সম্পূর্ণ করুন। জমা দেওয়ার পর রেকর্ডিংটি পর্যালোচনার জন্য পাঠানো হবে।</p>
   </div>
   <div className="mt-8"><UploadStepper books={books} /></div>
  </div>
 </NarratorShell>;
}