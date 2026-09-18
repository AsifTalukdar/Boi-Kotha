import { Icon } from "@/components/Icon";
import type { UploadableBook } from "@/lib/supabase/queries";
import { memo } from "react";

export type UploadMode = "book" | "manual";

interface Props {
  books: UploadableBook[];
  mode: UploadMode;
  setMode: (m: UploadMode) => void;
  selectedBookId: string;
  setSelectedBookId: (id: string) => void;
  manualTitle: string;
  setManualTitle: (t: string) => void;
  manualAuthor: string;
  setManualAuthor: (a: string) => void;
  manualDescription: string;
  setManualDescription: (d: string) => void;
  manualCoverColor: string;
  setManualCoverColor: (c: string) => void;
  creatingBook: boolean;
  handleCreateBook: () => void;
  manualError: string;
  manualCreated: boolean;
  setManualCreated: (c: boolean) => void;
}

export const StepSelectBook = memo(function StepSelectBook({
  books, mode, setMode, selectedBookId, setSelectedBookId,
  manualTitle, setManualTitle, manualAuthor, setManualAuthor,
  manualDescription, setManualDescription, manualCoverColor, setManualCoverColor,
  creatingBook, handleCreateBook, manualError, manualCreated, setManualCreated
}: Props) {
  return (
    <section>
      <p className="eyebrow">ধাপ ০১</p>
      <h2 className="serif mt-2 text-2xl font-bold">কোন বইটি রেকর্ড করবেন?</h2>
      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">লাইব্রেরিতে থাকা একটি বই বেছে নিন, অথবা নতুন বই যোগ করুন।</p>
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-[#f5ede3] p-1">
        <button type="button" onClick={() => { setMode("book"); setManualCreated(false); }} className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === "book" ? "bg-white text-[var(--maroon)] shadow-sm" : "text-[var(--muted)]"}`}>বই বেছে নিন</button>
        <button type="button" onClick={() => setMode("manual")} className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === "manual" ? "bg-white text-[var(--maroon)] shadow-sm" : "text-[var(--muted)]"}`}>নতুন বিষয় দিন</button>
      </div>
      {mode === "book" ? (
        <div className="mt-4 space-y-2">
          {books.length === 0 && <p className="text-sm text-[var(--muted)]">লাইব্রেরিতে এখনো কোনো বই যোগ করা হয়নি।</p>}
          {books.map((book) => (
            <label key={book.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${selectedBookId === book.id ? "border-[var(--amber)] bg-[#fff9f1]" : "border-[var(--line)] hover:border-[#d6baa1]"}`}>
              <input type="radio" name="book" value={book.id} checked={selectedBookId === book.id} onChange={() => setSelectedBookId(book.id)} className="accent-[var(--maroon)]" />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{book.title}</span><span className="mt-0.5 block text-[11px] text-[var(--muted)]">{book.author}</span></span>
            </label>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {manualCreated ? (
            <div className="rounded-xl border border-[var(--amber)] bg-[#fff9f1] p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e2ebdd] text-[#63745d]"><Icon name="check" size={14} /></span>
                <span className="text-sm font-bold">বই তৈরি হয়েছে!</span>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">"{manualTitle}" সফলভাবে যোগ করা হয়েছে এবং নির্বাচিত। এগিয়ে যান →</p>
            </div>
          ) : (
            <>
              <label className="block">
                <span className="text-xs font-bold text-[var(--muted)]">শিরোনাম (বাংলা) *</span>
                <input value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} placeholder="যেমন: পথের পাঁচালী" className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:border-[var(--amber)] focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-[var(--muted)]">লেখক (বাংলা)</span>
                <input value={manualAuthor} onChange={(e) => setManualAuthor(e.target.value)} placeholder="যেমন: বিভূতিভূষণ বন্দ্যোপাধ্যায়" className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:border-[var(--amber)] focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-[var(--muted)]">সংক্ষিপ্ত বর্ণনা</span>
                <textarea value={manualDescription} onChange={(e) => setManualDescription(e.target.value)} rows={2} placeholder="বইটির বিষয়বস্তু সম্পর্কে সংক্ষেপে লিখুন…" className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:border-[var(--amber)] focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-[var(--muted)]">বইয়ের কভার রং</span>
                <div className="mt-1 flex items-center gap-3">
                  <input type="color" value={manualCoverColor} onChange={(e) => setManualCoverColor(e.target.value)} className="h-10 w-12 cursor-pointer rounded border border-[var(--line)] bg-white p-0.5" />
                  <span className="text-xs text-[var(--muted)]">রং বেছে নিন অথবা ডিফল্ট ব্যবহার করুন</span>
                </div>
              </label>
              {manualError && <p className="text-xs font-bold text-red-600">{manualError}</p>}
              <button type="button" onClick={handleCreateBook} disabled={creatingBook || !manualTitle.trim()} className="rounded-xl bg-[var(--maroon)] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
                {creatingBook ? "তৈরি হচ্ছে…" : "বই তৈরি করুন"}
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
});
