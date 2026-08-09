import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f3e8db] px-5 py-10"><div className="w-full max-w-md">
    <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--maroon)] text-lg text-[#f8d5a5]">ব</span><span className="serif text-lg font-bold">বই কথা</span></Link>
    <section className="rounded-3xl border border-[var(--line)] bg-[var(--cream)] p-7 soft-shadow sm:p-9"><div className="mb-7 text-center"><p className="eyebrow">আজ থেকেই শোনা শুরু</p><h1 className="serif mt-3 text-3xl font-bold">আপনার জায়গা বানান</h1><p className="mt-2 text-sm text-[var(--muted)]">গল্প জমা রাখুন, নতুন কণ্ঠ আবিষ্কার করুন।</p></div>
      <SignupForm />
      <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]" />অথবা<span className="h-px flex-1 bg-[var(--line)]" /></div>
      <GoogleButton />
      <p className="mt-7 text-center text-xs text-[var(--muted)]">আগেই অ্যাকাউন্ট আছে? <Link href="/login" className="font-bold text-[var(--maroon)]">লগ ইন করুন</Link></p>
    </section>
  </div></main>;
}
