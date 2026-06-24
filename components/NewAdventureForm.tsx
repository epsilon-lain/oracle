"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveCurrentGameState } from "@/lib/game-storage";
import { createGameStateFromRun } from "@/lib/mock-gm";
import { narrativeOnlyRulePack, neonLiteRulePack } from "@/lib/rule-packs";
import type { AdventureMode, RuleStyle } from "@/lib/types";
import { neonRainAlleyWorldPack } from "@/lib/world-packs";

const modes: AdventureMode[] = ["Import World Pack", "Blank Improvised Run"];
const ruleStyles: RuleStyle[] = ["Narrative Only", "Light Dice Rules"];

export function NewAdventureForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const mode = readChoice<AdventureMode>(formData, "mode", "Import World Pack");
    const ruleStyle = readChoice<RuleStyle>(formData, "ruleStyle", "Light Dice Rules");
    const rulePackId =
      ruleStyle === "Narrative Only" ? narrativeOnlyRulePack.id : neonLiteRulePack.id;
    const gameState = createGameStateFromRun({
      mode,
      ruleStyle,
      worldPackId: neonRainAlleyWorldPack.id,
      rulePackId,
      name: readString(formData, "name"),
      role: readString(formData, "role"),
      strengths: splitList(readString(formData, "strengths")),
      weakness: readString(formData, "weakness"),
      startingItems: splitList(readString(formData, "items")),
    });

    saveCurrentGameState(gameState);
    router.push("/play");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid content-start gap-7 rounded-sm border border-bone/12 bg-smoke/80 p-5 shadow-glow sm:p-7"
    >
      <fieldset>
        <legend className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-rain">
          Mode
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {modes.map((mode, index) => (
            <label
              key={mode}
              className="cursor-pointer border border-bone/14 bg-ink/50 p-4 text-sm transition has-[:checked]:border-rain has-[:checked]:bg-rain/10"
            >
              <input
                className="sr-only"
                type="radio"
                name="mode"
                value={mode}
                defaultChecked={index === 0}
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-rain">
          Rule Style
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ruleStyles.map((style, index) => (
            <label
              key={style}
              className="cursor-pointer border border-bone/14 bg-ink/50 p-4 text-sm transition has-[:checked]:border-ember has-[:checked]:bg-ember/10"
            >
              <input
                className="sr-only"
                type="radio"
                name="ruleStyle"
                value={style}
                defaultChecked={index === 1}
              />
              <span>{style}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-rain">
          Character
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-bone/70">
            Name
            <input
              name="name"
              placeholder="Mara Venn"
              className="border border-bone/12 bg-ink px-3 py-3 text-bone outline-none transition placeholder:text-bone/30 focus:border-rain"
            />
          </label>
          <label className="grid gap-2 text-sm text-bone/70">
            Role
            <input
              name="role"
              placeholder="street medic"
              className="border border-bone/12 bg-ink px-3 py-3 text-bone outline-none transition placeholder:text-bone/30 focus:border-rain"
            />
          </label>
          <label className="grid gap-2 text-sm text-bone/70">
            Strengths
            <input
              name="strengths"
              placeholder="steady hands, reads people"
              className="border border-bone/12 bg-ink px-3 py-3 text-bone outline-none transition placeholder:text-bone/30 focus:border-rain"
            />
          </label>
          <label className="grid gap-2 text-sm text-bone/70">
            Weakness
            <input
              name="weakness"
              placeholder="answers every distress call"
              className="border border-bone/12 bg-ink px-3 py-3 text-bone outline-none transition placeholder:text-bone/30 focus:border-rain"
            />
          </label>
          <label className="grid gap-2 text-sm text-bone/70 sm:col-span-2">
            Starting Items
            <textarea
              name="items"
              rows={4}
              placeholder="rain coat, cracked phone, pocket flashlight"
              className="resize-none border border-bone/12 bg-ink px-3 py-3 text-bone outline-none transition placeholder:text-bone/30 focus:border-rain"
            />
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-bone/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-bone/55">No account or API key needed for this mock run.</p>
        <button
          type="submit"
          className="border border-rain bg-rain px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-bone"
        >
          Begin Run
        </button>
      </div>
    </form>
  );
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readChoice<T extends string>(formData: FormData, key: string, fallback: T): T {
  const value = formData.get(key);
  return typeof value === "string" ? (value as T) : fallback;
}

function splitList(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
