import Link from "next/link";
import { Icon } from "@/components/Icon";
import { memo } from "react";

export const StepSuccess = memo(function StepSuccess() {
  return (
    <section className="py-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e2ebdd] text-[#63745d]"><Icon name="check" size={28} /></div>
      <p className="eyebrow mt-6">জমা দেওয়া হয়েছে</p>
      <h2 className="serif mt-2 text-3xl font-bold">আপনার রেকর্ডিং পর্যালোচনাধীন</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">quality এবং স্বত্ব ঘোষণা যাচাই শেষ হলে আপনাকে জানানো হবে।</p>
      <Link href="/narrator" className="mt-7 inline-flex rounded-xl bg-[var(--maroon)] px-5 py-3 text-sm font-bold text-white">ন্যারেটর ড্যাশবোর্ডে ফিরুন</Link>
    </section>
  );
});
