"use client";
import { useState, useTransition } from "react";
import { Icon } from "./Icon";
import { approveRecording, rejectRecording, deleteRecording } from "@/lib/actions/moderation";

type Row = { id: string; title: string; narrator: string; duration: string; submitted: string; quality: string; safety: string };

export function ModerationRow({ item }: { item: Row }) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handlePlay = async () => {
    if (audioUrl) {
      setAudioUrl(null);
      return;
    }
    setLoadingAudio(true);
    try {
      const res = await fetch(`/api/recordings/${item.id}/signed-url`);
      const body = await res.json();
      if (body.url) setAudioUrl(body.url);
    } finally {
      setLoadingAudio(false);
    }
  };

  const handleDelete = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteRecording(item.id);
    });
  };

  return (
    <div className="border-b border-[#ededeb] last:border-0">
      <div className="grid gap-4 px-5 py-4 text-sm sm:grid-cols-[1.6fr_1fr_.8fr_.9fr_auto] sm:items-center">
        <div>
          <div className="font-bold">{item.title}</div>
          <div className="mt-1 text-xs text-[#7d857e]">{item.narrator} · {item.duration}</div>
        </div>
        <div className="text-xs text-[#7d857e]">জমা: {item.submitted}</div>
        <div className="flex gap-2">
          <span className="status status-green">AI {item.quality}</span>
          <span className="status status-green">নিরাপদ</span>
        </div>
        <button
          type="button"
          onClick={handlePlay}
          disabled={loadingAudio}
          className="flex items-center gap-2 text-xs font-bold text-[var(--maroon)] disabled:opacity-50"
        >
          <Icon name={audioUrl ? "pause" : "play"} size={12} />
          {loadingAudio ? "লোড হচ্ছে…" : audioUrl ? "থামুন" : "শুনে দেখুন"}
        </button>
        <div className="flex gap-2 sm:justify-end">
          {status === "pending" ? (
            <>
              <button
                onClick={() => { setStatus("rejected"); rejectRecording(item.id); }}
                className="rounded-lg border border-[#e5c9c2] px-3 py-2 text-xs font-bold text-[#9c5044]"
              >বাতিল</button>
              <button
                onClick={() => { setStatus("approved"); approveRecording(item.id); }}
                className="rounded-lg bg-[var(--sage)] px-3 py-2 text-xs font-bold text-white"
              >অনুমোদন</button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${deleteConfirm ? "border-red-300 bg-red-50 text-red-600" : "border-[#dedfd9] text-[#7d857e] hover:bg-red-50"}`}
              >
                {deleteConfirm ? "নিশ্চিত?" : "মুছুন"}
              </button>
            </>
          ) : status === "approved" ? (
            <span className="status status-green">অনুমোদিত</span>
          ) : (
            <span className="status status-red">বাতিল করা হয়েছে</span>
          )}
        </div>
      </div>
      {audioUrl && (
        <div className="border-t border-[#f0eeea] bg-[#fafaf8] px-5 py-3">
          <audio controls autoPlay src={audioUrl} className="w-full h-9" />
        </div>
      )}
    </div>
  );
}
