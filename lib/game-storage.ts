import type { GameState } from "@/lib/types";

export const CURRENT_GAME_STORAGE_KEY = "oracle.currentGameState";

export function loadCurrentGameState(): GameState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawGameState = window.localStorage.getItem(CURRENT_GAME_STORAGE_KEY);

  if (!rawGameState) {
    return null;
  }

  try {
    const parsedGameState: unknown = JSON.parse(rawGameState);
    return isGameState(parsedGameState) ? parsedGameState : null;
  } catch {
    return null;
  }
}

export function saveCurrentGameState(gameState: GameState) {
  window.localStorage.setItem(CURRENT_GAME_STORAGE_KEY, JSON.stringify(gameState));
}

export function hasCurrentGameState() {
  return loadCurrentGameState() !== null;
}

function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GameState>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.turn === "number" &&
    typeof candidate.worldPackId === "string" &&
    typeof candidate.rulePackId === "string" &&
    typeof candidate.player === "object" &&
    typeof candidate.world === "object" &&
    Array.isArray(candidate.messages)
  );
}
