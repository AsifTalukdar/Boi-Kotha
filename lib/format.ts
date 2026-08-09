const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBnDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => bnDigits[Number(digit)]);
}

/** Formats a seconds count as "mm:ss" using Bangla digits, e.g. 125 -> "২:০৫" */
export function formatClock(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return toBnDigits("0:00");
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const padded = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return toBnDigits(padded);
}

/** Formats a seconds count as "X ঘ Y মি" / "Y মি", e.g. 3600 -> "১ ঘ ০০ মি" */
export function formatDurationLong(totalSeconds: number | null | undefined): string {
  if (!totalSeconds || totalSeconds <= 0) return "অজানা";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  if (hours > 0) return toBnDigits(`${hours} ঘ ${minutes.toString().padStart(2, "0")} মি`);
  return toBnDigits(`${minutes} মি`);
}