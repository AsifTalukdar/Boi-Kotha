"use client";

import { useEffect, useRef, useState } from "react";
import { CoverArt } from "./BookCard";
import { Icon } from "./Icon";
import { usePlayer } from "./PlayerContext";
import { formatClock } from "@/lib/format";

const speedToRate: Record<string, number> = { "1x": 1, "1.25x": 1.25, "1.5x": 1.5 };

function ProgressBar({ audioRef, duration }: { audioRef: React.RefObject<HTMLAudioElement | null>; duration: number }) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setCurrentTime(audio.currentTime);

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedData = () => setCurrentTime(audio.currentTime);
    
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadeddata", handleLoadedData);
    
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [audioRef]);

  return (
    <div className="hidden w-[30%] items-center gap-3 md:flex">
      <span className="text-[11px] text-[var(--muted)]">{formatClock(currentTime)}</span>
      <input
        aria-label="অডিও অগ্রগতি"
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(event) => {
          const value = Number(event.target.value);
          setCurrentTime(value);
          if (audioRef.current) audioRef.current.currentTime = value;
        }}
        className="audio-range"
      />
      <span className="text-[11px] text-[var(--muted)]">{formatClock(duration)}</span>
    </div>
  );
}

export function AudioPlayer() {
  const { currentTrack, isPlaying, speed, toggle, pause, cycleSpeed } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load a fresh signed URL whenever the selected recording changes.
  useEffect(() => {
    if (!currentTrack) return;
    let cancelled = false;
    setLoading(true);
    setErrorMessage("");

    fetch(`/api/recordings/${currentTrack.recordingId}/signed-url`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "অডিও লোড করা যায়নি।");
        return body as { url: string; durationSeconds: number | null };
      })
      .then(({ url, durationSeconds }) => {
        if (cancelled || !audioRef.current) return;
        audioRef.current.src = url;
        if (durationSeconds) setDuration(durationSeconds);
        audioRef.current.play().catch(() => {});
      })
      .catch((error: Error) => {
        if (!cancelled) setErrorMessage(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.recordingId]);

  // Keep the <audio> element's play/pause state in sync with context.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speedToRate[speed] ?? 1;
  }, [speed]);

  if (!currentTrack) return null;
  const { book, narratorName } = currentTrack;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[#fffaf4]/95 px-4 py-3 shadow-[0_-10px_35px_rgba(91,53,32,.08)] backdrop-blur-md sm:px-6">
      <audio
        ref={audioRef}
        onLoadedMetadata={(event) => {
          if (!duration && Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration);
        }}
        onEnded={pause}
      />
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 sm:gap-6">
        <div className="hidden sm:block"><CoverArt book={book} small /></div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{book.title}</p>
          <p className="truncate text-xs text-[var(--muted)]">
            {narratorName}
            {loading && " · লোড হচ্ছে…"}
            {errorMessage && ` · ${errorMessage}`}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--maroon)] text-white disabled:opacity-50"
        >
          <Icon name={isPlaying ? "pause" : "play"} size={17} />
        </button>
        <ProgressBar audioRef={audioRef} duration={duration} />
        <button type="button" onClick={cycleSpeed} className="rounded-md border border-[var(--line)] px-2 py-1 text-[11px] font-bold text-[var(--muted)]">
          {speed}
        </button>
      </div>
    </div>
  );
}