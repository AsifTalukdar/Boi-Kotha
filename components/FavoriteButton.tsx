"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/lib/actions/favorites";
import { Icon } from "@/components/Icon";

export function FavoriteButton({ bookId, initialFavorited = false, className = "" }:
  { bookId: string; initialFavorited?: boolean; className?: string }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onClick = () => {
    const prev = favorited;
    setFavorited(!prev);                                  // optimistic
    startTransition(async () => {
      const res = await toggleFavorite(bookId, prev);     // pass CURRENT state
      if (res.error === "not_authenticated") {
        router.push(`/login?next=${encodeURIComponent(location.pathname)}`);
        setFavorited(prev);                               // revert
      } else if (res.error) {
        setFavorited(prev);                               // revert on failure
      }
    });
  };

  return (
    <button type="button" onClick={onClick} disabled={isPending}
      aria-label={favorited ? "পছন্দ থেকে সরান" : "পছন্দে রাখুন"} aria-pressed={favorited}
<<<<<<< HEAD
      className={`rounded-full bg-black/25 p-2 backdrop-blur-sm transition hover:bg-black/40 disabled:opacity-60 ${favorited ? "text-red-400" : "text-white"} ${className}`}>
      <Icon name="heart" size={15} />
    </button>
  );
}
=======
      className={`rounded-full bg-black/25 p-2 backdrop-blur-sm transition hover:bg-black/40 ${favorited ? "text-red-400" : "text-white"} ${className}`}>
      <Icon name="heart" size={15} />
    </button>
  );
}
>>>>>>> 2ab7aa76f7999d2438f175506db4e436eba6a695
