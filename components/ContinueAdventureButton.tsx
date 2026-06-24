"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hasCurrentGameState } from "@/lib/game-storage";

export function ContinueAdventureButton() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  function handleClick() {
    if (hasCurrentGameState()) {
      router.push("/play");
      return;
    }

    setMessage("No saved run yet. Start a new adventure to set the table.");
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center border border-bone/25 bg-ink/50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-bone backdrop-blur transition hover:border-rain hover:text-rain"
      >
        Continue Adventure
      </button>
      {message ? <p className="max-w-xs text-xs leading-5 text-rain">{message}</p> : null}
    </div>
  );
}
