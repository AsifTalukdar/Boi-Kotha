import { Icon } from "@/components/Icon";
import { ChangeEvent, DragEvent, memo } from "react";

interface Props {
  audioFile: File | null;
  changeAudio: (e: ChangeEvent<HTMLInputElement>) => void;
  dropAudio: (e: DragEvent<HTMLDivElement>) => void;
  uploading: boolean;
  uploadError: string;
}

export const StepAudio = memo(function StepAudio({
  audioFile, changeAudio, dropAudio, uploading, uploadError
}: Props) {
  return (
    <section>
      <p className="eyebrow">ধাপ ০৩</p>
      <h2 className="serif mt-2 text-2xl font-bold">রেকর্ডিং আপলোড করুন</h2>
      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">MP3, WAV বা M4A ফাইল দিন। আপলোডের পরে আমরা quality check করব।</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_.85fr]">
        <div onDragOver={(event) => event.preventDefault()} onDrop={dropAudio} className="flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d9c5b0] bg-[#fcf7f0] p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0dfcf] text-[var(--maroon)]"><Icon name="upload" size={22} /></div>
          <p className="mt-4 text-sm font-bold">অডিও ফাইল এখানে টেনে আনুন</p>
          <p className="mt-1 text-xs text-[var(--muted)]">MP3, WAV বা M4A · সর্বোচ্চ ৫০০ MB</p>
          <label className="mt-5 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold">
            ফাইল বেছে নিন
            <input type="file" accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,.mp3,.wav,.m4a" onChange={changeAudio} className="sr-only" />
          </label>
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
    </section>
  );
});
