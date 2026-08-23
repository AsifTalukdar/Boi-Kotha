"use client";

import { useState, useTransition } from "react";
import { toBnDigits } from "@/lib/format";

type Request = { headline: string; meta: string; votes: number; tint: string; icon: string };

export function RequestCard({
  request,
  onVote,
}: {
  request: Request;
  onVote?: (delta: number) => Promise<{ error: string | null }>;
}) {
  const [votes, setVotes] = useState(request.votes);
  const [voted, setVoted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleVote = () => {
    if (isPending || !onVote) return;
    const delta = voted ? -1 : 1;

    // Optimistic update — rolled back below if the server rejects it.
    setVoted((v) => !v);
    setVotes((v) => Math.max(0, v + delta));

    startTransition(async () => {
      const { error } = await onVote(delta);
      if (error) {
        setVoted((v) => !v);
        setVotes((v) => Math.max(0, v - delta));
      }
    });
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-4">
      <div
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
        style={{ backgroundColor: request.tint }}
      >
        {request.icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold sm:text-base">{request.headline}</h3>
        <p className="mt-1 truncate text-xs text-[var(--muted)]">{request.meta}</p>
      </div>
      <button
        type="button"
        onClick={handleVote}
        disabled={isPending}
        aria-pressed={voted}
        aria-label={voted ? "ভোট প্রত্যাহার করুন" : "ভোট দিন"}
        className={`flex min-w-[54px] flex-col items-center rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-60 ${voted ? "border-[var(--maroon)] bg-[var(--maroon)] text-white" : "border-[var(--line)] text-[var(--maroon)]"}`}
      >
        <span className="text-sm" aria-hidden="true">↑</span>
        {toBnDigits(votes)}
      </button>
    </div>
  );
}
