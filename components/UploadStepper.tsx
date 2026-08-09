"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UploadableBook } from "@/lib/supabase/queries";
import { Icon } from "./Icon";

const steps = ["বই বেছে নিন", "স্বত্ব ঘোষণা", "অডিও আপলোড", "নিশ্চিতকরণ"];
type UploadMode = "book" | "manual";
type CopyrightStatus = "public-domain" | "original" | "permission";

function readAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      resolve(Number.isFinite(audio.duration) ? audio.duration : null);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    audio.src = url;
  });
}

export function UploadStepper({ books }: { books: UploadableBook[] }) {
 const [step, setStep] = useState(1);
 const [mode, setMode] = useState<UploadMode>("book");
 const [selectedBookId, setSelectedBookId] = useState("");
 const [copyrightStatus, setCopyrightStatus] = useState<CopyrightStatus | "">("");
 const [proofName, setProofName] = useState("");
 const [audioFile, setAudioFile] = useState<File | null>(null);
 const [uploading, setUploading] = useState(false);
 const [uploadError, setUploadError] = useState("");

 const canContinue = uploading ? false : step === 1
  ? mode === "book" ? Boolean(selectedBookId) : false
  : step === 2
   ? Boolean(copyrightStatus) && (copyrightStatus !== "permission" || Boolean(proofName))
   : step === 3
    ? Boolean(audioFile)
    : true;

 const changeAudio = (event: ChangeEvent<HTMLInputElement>) => setAudioFile(event.target.files?.[0] ?? null);
 const dropAudio = (event: DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  setAudioFile(event.dataTransfer.files?.[0] ?? null);
 };

 const submitRecording = async () => {
  if (!audioFile || !selectedBookId) return;
  setUploading(true);
  setUploadError("");
  try {
   const formData = new FormData();
   formData.append("audio", audioFile);
   formData.append("bookId", selectedBookId);
   
   const res = await fetch("/api/upload", {
     method: "POST",
     body: formData
   });
   
   if (!res.ok) {
     const data = await res.json();
     throw new Error(data.error || "আপলোড ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
   }

   setStep(4);
  } catch (error) {
   setUploadError(error instanceof Error ? error.message : "আপলোড ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
  } finally {
   setUploading(false);
  }
 };

 const goNext = () => {
  if (step === 3) {
   submitRecording();
   return;
  }
  setStep((current) => current + 1);
 };

 return <div className="rounded-3xl border border-[var(--line)] bg-[var(--cream)] p-5 shadow-[0_12px_35px_rgba(91,53,32,.05)] sm:p-7">
  <ol className="mb-8 grid grid-cols-4 gap-2">
   {steps.map((label, index) => {
    const number = index + 1;
    const done = step > number;
    const active = step === number;
    return <li key={label} className="relative flex flex-col items-center gap-2 text-center">
     {number < steps.length && <span className={`absolute left-1/2 top-4 h-px w-full ${done ? "bg-[var(--maroon)]" : "bg-[var(--line)]"}`} />}
     <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${active || done ? "bg-[var(--maroon)] text-white" : "border border-[var(--line)] bg-[var(--cream)] text-[var(--muted)]"}`}>{done ? <Icon name="check" size={15} /> : number}</span>
     <span className={`hidden text-[10px] font-bold sm:block ${active ? "text-[var(--maroon)]" : "text-[var(--muted)]"}`}>{label}</span>
    </li>;
   })}
  </ol>

  {step === 1 && <section>
   <p className="eyebrow">ধাপ ০১</p>
   <h2 className="serif mt-2 text-2xl font-bold">কোন বইটি রেকর্ড করবেন?</h2>
   <p className="mt-1 text-sm leading-6 text-[var(--muted)]">লাইব্রেরিতে থাকা একটি বই বেছে নিন। নতুন বই বা বিষয় যোগ করার অপশন শিগগিরই আসছে।</p>
   <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-[#f5ede3] p-1">
    <button type="button" onClick={() => setMode("book")} className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === "book" ? "bg-white text-[var(--maroon)] shadow-sm" : "text-[var(--muted)]"}`}>বই বেছে নিন</button>
    <button type="button" onClick={() => setMode("manual")} className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === "manual" ? "bg-white text-[var(--maroon)] shadow-sm" : "text-[var(--muted)]"}`}>নতুন বিষয় দিন</button>
   </div>
   {mode === "book" ? <div className="mt-4 space-y-2">
    {books.length === 0 && <p className="text-sm text-[var(--muted)]">লাইব্রেরিতে এখনো কোনো বই যোগ করা হয়নি।</p>}
    {books.map((book) => <label key={book.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${selectedBookId === book.id ? "border-[var(--amber)] bg-[#fff9f1]" : "border-[var(--line)] hover:border-[#d6baa1]"}`}>
     <input type="radio" name="book" value={book.id} checked={selectedBookId === book.id} onChange={() => setSelectedBookId(book.id)} className="accent-[var(--maroon)]" />
     <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{book.title}</span><span className="mt-0.5 block text-[11px] text-[var(--muted)]">{book.author}</span></span>
    </label>)}
   </div> : <div className="mt-4 rounded-xl border border-dashed border-[#d6baa1] bg-[#fcf7f0] p-4 text-xs leading-5 text-[var(--muted)]">এই অপশনটি শিগগিরই আসছে — আপাতত বিদ্যমান তালিকা থেকে একটি বই বেছে নিন।</div>}
  </section>}

  {step === 2 && <section>
   <p className="eyebrow">ধাপ ০২</p>
   <h2 className="serif mt-2 text-2xl font-bold">স্বত্ব ঘোষণা</h2>
   <p className="mt-1 text-sm leading-6 text-[var(--muted)]">আপলোডের আগে কনটেন্ট ব্যবহারের অধিকার সম্পর্কে সঠিক তথ্য দিন।</p>
   <div className="mt-5 space-y-3">
    {[
     ["public-domain", "এটি পাবলিক ডোমেইনের একটি কাজ", "কপিরাইট মেয়াদ শেষ হয়েছে"],
     ["original", "এটি আমার নিজের মৌলিক কাজ", "লেখা ও রেকর্ডিং—দুটিই আমার"],
     ["permission", "আমার লিখিত অনুমতি আছে", "লেখক, প্রকাশক বা রাইটস-হোল্ডারের অনুমতি"],
    ].map(([value, label, hint]) => <label key={value} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${copyrightStatus === value ? "border-[var(--amber)] bg-[#fff9f1]" : "border-[var(--line)]"}`}>
     <input type="radio" name="copyright" value={value} checked={copyrightStatus === value} onChange={() => setCopyrightStatus(value as CopyrightStatus)} className="mt-1 accent-[var(--maroon)]" />
     <span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs text-[var(--muted)]">{hint}</span></span>
    </label>)}
   </div>
   {copyrightStatus === "permission" && <label className="mt-4 block rounded-xl border border-dashed border-[#d6baa1] bg-[#fcf7f0] p-4 text-sm font-bold text-[var(--maroon)]">
    অনুমতির প্রমাণ আপলোড করুন
    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setProofName(event.target.files?.[0]?.name ?? "")} className="mt-2 block w-full text-xs font-normal text-[var(--muted)]" />
    {proofName && <span className="mt-2 block text-xs text-[var(--sage)]">নির্বাচিত: {proofName}</span>}
   </label>}
  </section>}

  {step === 3 && <section>
   <p className="eyebrow">ধাপ ০৩</p>
   <h2 className="serif mt-2 text-2xl font-bold">রেকর্ডিং আপলোড করুন</h2>
   <p className="mt-1 text-sm leading-6 text-[var(--muted)]">MP3, WAV বা M4A ফাইল দিন। আপলোডের পরে আমরা quality check করব।</p>
   <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_.85fr]">
    <div onDragOver={(event) => event.preventDefault()} onDrop={dropAudio} className="flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d9c5b0] bg-[#fcf7f0] p-6 text-center">
     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0dfcf] text-[var(--maroon)]"><Icon name="upload" size={22} /></div>
     <p className="mt-4 text-sm font-bold">অডিও ফাইল এখানে টেনে আনুন</p>
     <p className="mt-1 text-xs text-[var(--muted)]">MP3, WAV বা M4A · সর্বোচ্চ ৫০০ MB</p>
     <label className="mt-5 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold">ফাইল বেছে নিন<input type="file" accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,.mp3,.wav,.m4a" onChange={changeAudio} className="sr-only" /></label>
     {audioFile && <p className="mt-4 max-w-full truncate text-xs font-bold text-[var(--sage)]">✓ {audioFile.name}</p>}
     {uploading && <p className="mt-3 text-xs font-bold text-[var(--maroon)]">আপলোড হচ্ছে…</p>}
     {uploadError && <p className="mt-3 text-xs font-bold text-red-600">{uploadError}</p>}
    </div>
    <aside className="rounded-2xl bg-[#eef0e8] p-5 text-[#56614d]">
     <p className="text-xs font-bold uppercase tracking-[.14em]">রেকর্ডিং গাইডলাইন</p>
     <ul className="mt-4 space-y-3 text-xs leading-5">
      <li>শান্ত ঘরে রেকর্ড করুন; ফ্যান বা বাইরের শব্দ এড়িয়ে চলুন।</li>
      <li>মাইক্রোফোন মুখ থেকে ৬–৮ ইঞ্চি দূরে রাখুন।</li>
      <li>স্বাভাবিক গতিতে ও স্পষ্ট উচ্চারণে পড়ুন।</li>
      <li>বাক্যের মাঝে স্বাভাবিক বিরতি রাখুন।</li>
     </ul>
    </aside>
   </div>
  </section>}

  {step === 4 && <section className="py-8 text-center">
   <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e2ebdd] text-[#63745d]"><Icon name="check" size={28} /></div>
   <p className="eyebrow mt-6">জমা দেওয়া হয়েছে</p>
   <h2 className="serif mt-2 text-3xl font-bold">আপনার রেকর্ডিং পর্যালোচনাধীন</h2>
   <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">quality এবং স্বত্ব ঘোষণা যাচাই শেষ হলে আপনাকে জানানো হবে।</p>
   <Link href="/narrator" className="mt-7 inline-flex rounded-xl bg-[var(--maroon)] px-5 py-3 text-sm font-bold text-white">ন্যারেটর ড্যাশবোর্ডে ফিরুন</Link>
  </section>}

  {step < 4 && <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-5">
   <button type="button" disabled={step === 1 || uploading} onClick={() => setStep((current) => current - 1)} className="rounded-xl px-3 py-2 text-sm font-bold text-[var(--muted)] disabled:opacity-30">পেছনে</button>
   <button type="button" disabled={!canContinue} onClick={goNext} className="rounded-xl bg-[var(--maroon)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{step === 3 ? (uploading ? "আপলোড হচ্ছে…" : "জমা দিন") : "এগিয়ে যান"} →</button>
  </div>}
 </div>;
}