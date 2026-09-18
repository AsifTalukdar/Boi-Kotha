import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
      <p className="serif text-6xl font-bold text-[var(--maroon)]">৪০৪</p>
      <h1 className="serif mt-4 text-2xl font-bold">পাতাটি খুঁজে পাওয়া যায়নি</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        আপনি যে পাতাটি খুঁজছেন সেটি সরিয়ে ফেলা হয়েছে অথবা এর ঠিকানাটি ভুল। চলুন আবার লাইব্রেরিতে ফিরে যাই।
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="rounded-xl bg-[var(--maroon)] px-5 py-3 text-sm font-bold text-white">
          হোমে ফিরুন
        </Link>
        <Link href="/search" className="rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-bold text-[var(--maroon)]">
          বই খুঁজুন
        </Link>
      </div>
    </div>
  );
}
