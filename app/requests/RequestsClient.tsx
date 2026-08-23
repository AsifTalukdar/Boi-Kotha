"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { RequestCard } from "@/components/RequestCard";
import { addRequest, voteRequest } from "@/lib/actions/requests";
import type { RequestRow } from "@/lib/supabase/request_queries";
import { toBnDigits } from "@/lib/format";

const ALL = "সব রিকোয়েস্ট";
const CATEGORIES = ["উপন্যাস", "ছোটগল্প", "কবিতা", "স্মৃতিকথা"];

function getCategoryColor(category: string) {
  if (category === "উপন্যাস") return { tint: "#ead5bd", icon: "বই" };
  if (category === "কবিতা") return { tint: "#dce0cc", icon: "ক" };
  if (category === "স্মৃতিকথা") return { tint: "#e4c9c2", icon: "স্ম" };
  return { tint: "#d9d7e4", icon: "গল্প" };
}

function bnDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return toBnDigits(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
}

export function RequestsClient({
  initialRequests,
  isAuthenticated = false,
}: {
  initialRequests: RequestRow[];
  isAuthenticated?: boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState(ALL);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [authorBn, setAuthorBn] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, startSubmit] = useTransition();

  const filtered = useMemo(
    () => (filter === ALL ? initialRequests : initialRequests.filter((r) => r.category === filter)),
    [filter, initialRequests]
  );

  const loginRedirect = () => router.push(`/login?next=${encodeURIComponent("/requests")}`);

  const handleNewRequestClick = () => {
    if (!isAuthenticated) {
      loginRedirect();
      return;
    }
    setFormError("");
    setShowForm((v) => !v);
  };

  const handleVote = async (id: string, delta: number) => {
    if (!isAuthenticated) {
      loginRedirect();
      return { error: "not_authenticated" };
    }
    return voteRequest(id, delta);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setFormError("");
    startSubmit(async () => {
      const { error } = await addRequest({ description, authorBn, category });
      if (error === "not_authenticated") {
        loginRedirect();
        return;
      }
      if (error) {
        setFormError(error);
        return;
      }
      setDescription("");
      setAuthorBn("");
      setCategory(CATEGORIES[0]);
      setShowForm(false);
      router.refresh();
    });
  };

  const pills = [ALL, ...CATEGORIES];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">কমিউনিটি লাইব্রেরি</p>
          <h1 className="serif mt-2 text-4xl font-bold">রিকোয়েস্ট বোর্ড</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
            যে বই বা বিষয়টি শুনতে চান, তার জন্য ভোট দিন। বেশি ভোট পাওয়া রিকোয়েস্টে আমাদের ন্যারেটররা আগে কাজ করেন।
          </p>
        </div>
        <button
          type="button"
          onClick={handleNewRequestClick}
          aria-expanded={showForm}
          className="rounded-xl bg-[var(--maroon)] px-4 py-3 text-sm font-bold text-white"
        >
          {showForm ? "বন্ধ করুন" : "+ নতুন রিকোয়েস্ট"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label sm:col-span-2">
              বইয়ের নাম
              <input
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="field mt-2"
                placeholder="যেমন: শেষের কবিতা"
              />
            </label>
            <label className="field-label">
              লেখক
              <input
                value={authorBn}
                onChange={(event) => setAuthorBn(event.target.value)}
                className="field mt-2"
                placeholder="যেমন: রবীন্দ্রনাথ ঠাকুর"
              />
            </label>
            <label className="field-label">
              ধরন
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="field mt-2">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {formError && <p className="mt-3 text-xs text-red-700">{formError}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[var(--maroon)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {isSubmitting ? "যোগ হচ্ছে…" : "রিকোয়েস্ট যোগ করুন"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-bold text-[var(--muted)]"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      <div className="mt-10 flex gap-2 overflow-x-auto">
        {pills.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => setFilter(pill)}
            aria-pressed={filter === pill}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${filter === pill ? "bg-[var(--maroon)] text-white" : "border border-[var(--line)] text-[var(--muted)]"}`}
          >
            {pill}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-5 space-y-3">
          {filtered.map((req) => {
            const { tint, icon } = getCategoryColor(req.category);
            const meta = [req.author_bn, req.category, bnDate(req.created_at)].filter(Boolean).join(" · ");
            const mapped = { headline: req.description, meta, votes: req.votes, tint, icon };
            return <RequestCard key={req.id} request={mapped} onVote={(delta) => handleVote(req.id, delta)} />;
          })}
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--cream)] p-10 text-center text-[var(--muted)]">
          <p className="text-sm font-bold text-[var(--ink)]">
            {filter === ALL ? "এখনো কোনো রিকোয়েস্ট নেই" : "এই ধরনে এখনো কোনো রিকোয়েস্ট নেই"}
          </p>
          <p className="mt-2 text-xs">প্রথম রিকোয়েস্টটি আপনিই যোগ করুন — যে বইটি শুনতে চান তা জানান।</p>
        </div>
      )}

      <div className="mt-12 rounded-3xl bg-[#ead6bf] p-6 sm:p-8">
        <p className="eyebrow text-[#8b5b35]">আপনিও ন্যারেটর হতে পারেন</p>
        <h2 className="serif mt-2 text-2xl font-bold">আপনার কণ্ঠে একটি গল্প?</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">ভালোবাসার বইগুলো নতুন করে শোনান।</p>
        <Link href="/narrator" className="mt-4 inline-block rounded-xl bg-white px-4 py-3 text-sm font-bold text-[var(--maroon)]">
          ন্যারেটর স্টুডিও খুলুন →
        </Link>
      </div>
    </div>
  );
}
