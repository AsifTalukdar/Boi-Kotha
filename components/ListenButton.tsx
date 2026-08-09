"use client";

import type { Book } from "@/lib/data";
import { usePlayer } from "@/components/PlayerContext";
import { Icon } from "@/components/Icon";

export function ListenButton({
  book,
  recordingId,
  narratorName,
  compact = false,
}: {
  book: Book;
  recordingId: string;
  narratorName: string;
  compact?: boolean;
}) {
  const { currentTrack, isPlaying, play, toggle } = usePlayer();
  const isCurrent = currentTrack?.recordingId === recordingId;
  const onClick = () => (isCurrent ? toggle() : play(book, recordingId, narratorName));

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
      <Icon name={isCurrent && isPlaying ? "pause" : "play"} size={15} />
      {isCurrent && isPlaying ? "বিরতি দিন" : "এখনই শুনুন"}
    </button>
  );
}