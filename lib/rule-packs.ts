import type { RulePack } from "@/lib/types";

export const neonLiteRulePack: RulePack = {
  id: "neon-lite",
  title: "Neon Lite",
  mode: "light-dice",
  dice: "d10 + skill",
  skills: ["tech", "stealth", "talk", "fight", "observe"],
  difficulties: {
    easy: 8,
    normal: 12,
    hard: 16,
    extreme: 20,
  },
  resources: ["hp", "stress", "heat", "credits", "ammo"],
};

export const narrativeOnlyRulePack: RulePack = {
  id: "narrative-only",
  title: "Narrative Only",
  mode: "narrative",
  dice: "none",
  skills: ["tech", "stealth", "talk", "fight", "observe"],
  difficulties: {
    easy: 0,
    normal: 0,
    hard: 0,
    extreme: 0,
  },
  resources: ["hp", "stress", "heat", "credits", "ammo"],
};

export const rulePacks = [neonLiteRulePack, narrativeOnlyRulePack];
