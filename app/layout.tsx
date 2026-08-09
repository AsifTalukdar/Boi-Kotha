import type { Metadata } from "next";
import "./globals.css";
import {AppShell} from "@/components/AppShell";
import {AudioPlayer} from "@/components/AudioPlayer";
import {PlayerProvider} from "@/components/PlayerContext";

export const metadata: Metadata = {
  title: "বই কথা — গল্প শুনুন",
  description: "A warm, community-powered Bengali audiobook library.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body><PlayerProvider><AppShell>{children}</AppShell><AudioPlayer/></PlayerProvider></body>
    </html>
  );
}
