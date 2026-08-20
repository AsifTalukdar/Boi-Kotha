import { memo } from "react";

export type CopyrightStatus = "public-domain" | "original" | "permission";

interface Props {
  copyrightStatus: CopyrightStatus | "";
  setCopyrightStatus: (c: CopyrightStatus) => void;
  proofName: string;
  setProofName: (p: string) => void;
}

export const StepCopyright = memo(function StepCopyright({
  copyrightStatus, setCopyrightStatus, proofName, setProofName
}: Props) {
  return (
    <section>
      <p className="eyebrow">ধাপ ০২</p>
      <h2 className="serif mt-2 text-2xl font-bold">স্বত্ব ঘোষণা</h2>
      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">আপলোডের আগে কনটেন্ট ব্যবহারের অধিকার সম্পর্কে সঠিক তথ্য দিন।</p>
      <div className="mt-5 space-y-3">
        {[
          ["public-domain", "এটি পাবলিক ডোমেইনের একটি কাজ", "কপিরাইট মেয়াদ শেষ হয়েছে"],
          ["original", "এটি আমার নিজের মৌলিক কাজ", "লেখা ও রেকর্ডিং—দুটিই আমার"],
          ["permission", "আমার লিখিত অনুমতি আছে", "লেখক, প্রকাশক বা রাইটস-হোল্ডারের অনুমতি"],
        ].map(([value, label, hint]) => (
          <label key={value} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${copyrightStatus === value ? "border-[var(--amber)] bg-[#fff9f1]" : "border-[var(--line)]"}`}>
            <input type="radio" name="copyright" value={value} checked={copyrightStatus === value} onChange={() => setCopyrightStatus(value as CopyrightStatus)} className="mt-1 accent-[var(--maroon)]" />
            <span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs text-[var(--muted)]">{hint}</span></span>
          </label>
        ))}
      </div>
      {copyrightStatus === "permission" && (
        <label className="mt-4 block rounded-xl border border-dashed border-[#d6baa1] bg-[#fcf7f0] p-4 text-sm font-bold text-[var(--maroon)]">
          অনুমতির প্রমাণ আপলোড করুন
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setProofName(event.target.files?.[0]?.name ?? "")} className="mt-2 block w-full text-xs font-normal text-[var(--muted)]" />
          {proofName && <span className="mt-2 block text-xs text-[var(--sage)]">নির্বাচিত: {proofName}</span>}
        </label>
      )}
    </section>
  );
});
