"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { hasCurrentGameState } from "@/lib/game-storage";

const primaryButtonClass =
  "inline-flex items-center justify-center border border-rain bg-rain px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-bone disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClass =
  "inline-flex items-center justify-center border border-bone/25 bg-ink/50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-bone backdrop-blur transition hover:border-rain hover:text-rain disabled:cursor-not-allowed disabled:opacity-60";

const quietButtonClass =
  "inline-flex items-center justify-center border border-bone/20 bg-ink/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-bone/65 backdrop-blur transition hover:border-bone/35 hover:text-bone disabled:cursor-not-allowed disabled:opacity-60";

export function HomeActionButtons() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [message, setMessage] = useState("");

  function startNewAdventure() {
    if (isLoading) {
      return;
    }

    router.push(isAuthenticated ? "/new" : "/login?next=/new");
  }

  function continueAdventure() {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?next=/play");
      return;
    }

    if (hasCurrentGameState()) {
      router.push("/play");
      return;
    }

    setMessage("No saved adventure found. Start a new one?");
  }

  function showSettingsMessage() {
    setMessage("Settings coming soon.");
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={startNewAdventure}
          disabled={isLoading}
          className={primaryButtonClass}
        >
          Start New Adventure
        </button>
        <button
          type="button"
          onClick={continueAdventure}
          disabled={isLoading}
          className={secondaryButtonClass}
        >
          Continue Adventure
        </button>
        <button type="button" onClick={showSettingsMessage} className={quietButtonClass}>
          Settings
        </button>
      </div>
      {message ? <p className="max-w-md text-sm leading-6 text-rain">{message}</p> : null}
    </div>
  );
}
