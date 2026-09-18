import Link from "next/link";

export default function AuthCodeErrorPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f3e8db] px-5"><section className="rounded-3xl border border-[var(--line)] bg-[var(--cream)] p-8 text-center soft-shadow"><h1 className="serif text-3xl font-bold">Sign-in could not be completed</h1><p className="mt-3 text-sm text-[var(--muted)]">Please try again.</p><Link href="/login" className="mt-6 inline-flex rounded-xl bg-[var(--maroon)] px-5 py-3 text-sm font-bold text-white">Return to login</Link></section></main>;
}
