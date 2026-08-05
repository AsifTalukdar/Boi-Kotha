"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useState } from "react";
import { requests } from "@/lib/data";
import { Icon } from "./Icon";

const steps = ["বই বা বিষয়", "স্বত্ব ঘোষণা", "অডিও আপলোড", "নিশ্চিতকরণ"];
type UploadMode = "request" | "manual";
type CopyrightStatus = "public-domain" | "original" | "permission";

export function UploadStepper() {
 const [step, setStep] = useState(1);
 const [mode, setMode] = useState<UploadMode>("request");
 const [selectedRequest, setSelectedRequest] = useState("");
 const [copyrightStatus, setCopyrightStatus] = useState<CopyrightStatus | "">("");
 const [manualTitle, setManualTitle] = useState("");
 const [audioName, setAudioName] = useState("");
 const [proofName, setProofName] = useState("");

 const canContinue = step === 1
  ? mode === "request" ? Boolean(selectedRequest) : Boolean(manualTitle.trim())
  : step === 2
   ? Boolean(copyrightStatus) && (copyrightStatus !== "permission" || Boolean(proofName))
   : step === 3
    ? Boolean(audioName)
    : true;

 const changeAudio = (event: ChangeEvent<HTMLInputElement>) => setAudioName(event.target.files?.[0]?.name ?? "");
 const dropAudio = (event: DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  setAudioName(event.dataTransfer.files?.[0]?.name ?? "");
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
   <h2 className="serif mt-2 text-2xl font-bold">কী রেকর্ড করবেন?</h2>
   <p className="mt-1 text-sm leading-6 text-[var(--muted)]">খোলা রিকোয়েস্ট থেকে বেছে নিন, অথবা আপনার নিজের বই/বিষয়ের তথ্য দিন।</p>
   <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-[#f5ede3] p-1">
    <button type="button" onClick={() => setMode("request")} className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === "request" ? "bg-white text-[var(--maroon)] shadow-sm" : "text-[var(--muted)]"}`}>রিকোয়েস্ট বেছে নিন</button>
    <button type="button" onClick={() => setMode("manual")} className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === "manual" ? "bg-white text-[var(--maroon)] shadow-sm" : "text-[var(--muted)]"}`}>নতুন বিষয় দিন</button>
   </div>
   {mode === "request" ? <div className="mt-4 space-y-2">
    {requests.map((request) => <label key={request.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${selectedRequest === request.id ? "border-[var(--amber)] bg-[#fff9f1]" : "border-[var(--line)] hover:border-[#d6baa1]"}`}>
     <input type="radio" name="request" value={request.id} checked={selectedRequest === request.id} onChange={() => setSelectedRequest(request.id)} className="accent-[var(--maroon)]" />
     <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{request.title}</span><span className="mt-0.5 block text-[11px] text-[var(--muted)]">{request.meta} · {request.votes} ভোট</span></span>
    </label>)}
   </div> : <div className="mt-4 space-y-3">
    <input value={manualTitle} onChange={(event) => setManualTitle(event.target.value)} className="field" placeholder="বই বা বিষয়ের নাম" />
    <textarea className="field min-h-24 resize-y" placeholder="লেখক, বিষয়, বা রেকর্ডিং সম্পর্কে সংক্ষিপ্ত তথ্য" />
   </div>}
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
     {audioName && <p className="mt-4 max-w-full truncate text-xs font-bold text-[var(--sage)]">✓ {audioName}</p>}
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
   <button type="button" disabled={step === 1} onClick={() => setStep((current) => current - 1)} className="rounded-xl px-3 py-2 text-sm font-bold text-[var(--muted)] disabled:opacity-30">পেছনে</button>
   <button type="button" disabled={!canContinue} onClick={() => setStep((current) => current + 1)} className="rounded-xl bg-[var(--maroon)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{step === 3 ? "জমা দিন" : "এগিয়ে যান"} →</button>
  </div>}
 </div>;
}
