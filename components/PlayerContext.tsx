"use client";

import { createContext, useContext, useState } from "react";
import type { Book } from "@/lib/data";

export type CurrentTrack = { recordingId: string; book: Book; narratorName: string };

type PlayerContextValue = {
  currentTrack: CurrentTrack | null;
  isPlaying: boolean;
  speed: string;
  play: (book: Book, recordingId: string, narratorName: string) => void;
  toggle: () => void;
  pause: () => void;
  cycleSpeed: () => void;
  clear: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("1x");

  const play = (book: Book, recordingId: string, narratorName: string) => {
    setCurrentTrack((current) => {
      if (current?.recordingId === recordingId) return current; // same track, just resume
      return { recordingId, book, narratorName };
    });
    setIsPlaying(true);
  };
  const toggle = () => setIsPlaying((value) => !value);
  const pause = () => setIsPlaying(false);
  const cycleSpeed = () => setSpeed((value) => (value === "1x" ? "1.25x" : value === "1.25x" ? "1.5x" : "1x"));
  const clear = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, speed, play, toggle, pause, cycleSpeed, clear }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}