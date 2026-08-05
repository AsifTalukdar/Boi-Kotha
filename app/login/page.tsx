import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return <AuthLayout title="আবার ফিরে এসেছেন" subtitle="আপনার শোনার জায়গাটি অপেক্ষা করছে।">
    <LoginForm />
    <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]" />অথবা<span className="h-px flex-1 bg-[var(--line)]" /></div>
    <GoogleButton />
    <p className="mt-7 text-center text-xs text-[var(--muted)]">নতুন এখানে? <Link href="/signup" className="font-bold text-[var(--maroon)]">অ্যাকাউন্ট খুলুন</Link></p>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#f3e8db] px-5 py-10"><div className="w-full max-w-md">
    <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--maroon)] text-lg text-[#f8d5a5]">অ</span><span className="serif text-lg font-bold">[PROJECT NAME]</span></Link>
    <section className="rounded-3xl border border-[var(--line)] bg-[var(--cream)] p-7 soft-shadow sm:p-9"><div className="mb-7 text-center"><p className="eyebrow">আপনার অডিও লাইব্রেরি</p><h1 className="serif mt-3 text-3xl font-bold">{title}</h1><p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p></div>{children}</section>
  </div></main>;
}
