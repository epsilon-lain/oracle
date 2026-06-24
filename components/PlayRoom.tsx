"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MessageLog } from "@/components/MessageLog";
import { StatePanel } from "@/components/StatePanel";
import { loadCurrentGameState, saveCurrentGameState } from "@/lib/game-storage";
import { advanceMockGame } from "@/lib/mock-gm";
import type { GameState } from "@/lib/types";

type PlayRoomProps = {
  initialState: GameState;
};

const prompts = [
  "Observe the alley for anything the rain failed to erase.",
  "Talk to the night clerk about the missing doctor.",
  "Follow the first hint of the white suit.",
];

export function PlayRoom({ initialState }: PlayRoomProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [hasLoadedRun, setHasLoadedRun] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setGameState(loadCurrentGameState() ?? initialState);
    setHasLoadedRun(true);
  }, [initialState]);

  const activeQuest = useMemo(
    () => gameState.world.quests.find((quest) => quest.status === "active"),
    [gameState.world.quests],
  );

  function submitCommand(command: string) {
    const trimmed = command.trim();

    if (!trimmed) {
      return;
    }

    setGameState((current) => {
      const nextGameState = advanceMockGame(current, trimmed);
      saveCurrentGameState(nextGameState);
      return nextGameState;
    });
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitCommand(input);
  }

  if (!hasLoadedRun) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-6 text-bone">
        <div className="border border-bone/12 bg-smoke px-6 py-5 text-sm text-bone/70">
          Opening the current run...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-h-screen flex-col border-r border-bone/10 bg-[radial-gradient(circle_at_top_left,rgba(255,79,135,0.12),transparent_24rem)]">
          <header className="flex flex-col gap-3 border-b border-bone/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-rain">Oracle</p>
              <h1 className="mt-1 text-2xl font-semibold">{gameState.world.title}</h1>
            </div>
            <div className="text-sm text-bone/60">
              {activeQuest ? activeQuest.title : "No active quest"}
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
            <MessageLog messages={gameState.messages} />

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitCommand(prompt)}
                  className="border border-bone/12 bg-smoke/80 px-3 py-2 text-left text-xs leading-5 text-bone/70 transition hover:border-rain hover:text-rain"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-3 flex gap-3 border-t border-bone/10 pt-4">
              <label className="sr-only" htmlFor="player-input">
                Player input
              </label>
              <textarea
                id="player-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                placeholder="What do you do?"
                className="min-h-16 flex-1 resize-none border border-bone/12 bg-smoke px-4 py-3 text-sm leading-6 text-bone outline-none transition placeholder:text-bone/35 focus:border-rain"
              />
              <button
                type="submit"
                className="self-stretch border border-rain bg-rain px-5 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-bone"
              >
                Send
              </button>
            </form>
          </div>
        </section>

        <StatePanel gameState={gameState} />
      </div>
    </main>
  );
}
