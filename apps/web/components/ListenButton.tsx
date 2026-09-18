"use client";

import type { Book } from "@/lib/data";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/components/PlayerContext";
import { Icon } from "@/components/Icon";

export function ListenButton({
  book,
  recordingId,
  narratorName,
  compact = false,
  isAuthenticated = false,
}: {
  book: Book;
  recordingId: string;
  narratorName: string;
  compact?: boolean;
  isAuthenticated?: boolean;
}) {
  const { currentTrack, isPlaying, play, toggle } = usePlayer();
  const router = useRouter();
  const isCurrent = currentTrack?.recordingId === recordingId;

  const onClick = () => {
    // Playback needs a signed URL, and the API requires an authenticated user.
    // Send anonymous visitors to login instead of mounting a player that can
    // never load audio (the "pause button that plays nothing" bug).
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/books/${book.id}`)}`);
      return;
    }
    isCurrent ? toggle() : play(book, recordingId, narratorName);
  };

  if (compact)
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${book.title} শুনুন`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--maroon)] text-white"
      >
        <Icon name={isCurrent && isPlaying ? "pause" : "play"} size={14} />
      </button>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--maroon)] py-3 text-sm font-bold text-white"
    >
      <Icon name={!isAuthenticated ? "play" : isCurrent && isPlaying ? "pause" : "play"} size={15} />
      {!isAuthenticated ? "শুনতে লগ ইন করুন" : isCurrent && isPlaying ? "বিরতি দিন" : "এখনই শুনুন"}
    </button>
  );
}
