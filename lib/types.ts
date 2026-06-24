export type RuleMode = "narrative" | "light-dice";

export type AdventureMode = "Import World Pack" | "Blank Improvised Run";

export type RuleStyle = "Narrative Only" | "Light Dice Rules";

export type QuestStatus = "active" | "completed" | "failed";

export type MessageSpeaker = "gm" | "player" | "system";

export type CheckOutcome = "success" | "mixed" | "failure";

export type DifficultyLabel = "easy" | "normal" | "hard" | "extreme";

export type SkillName = "tech" | "stealth" | "talk" | "fight" | "observe";

export type DangerLevel = "low" | "rising" | "high" | "critical";

export interface CheckResult {
  id: string;
  turn: number;
  skill: SkillName;
  difficultyLabel: DifficultyLabel;
  target: number;
  roll: number;
  modifier: number;
  total: number;
  outcome: CheckOutcome;
  consequence: string;
}

export interface Message {
  id: string;
  speaker: MessageSpeaker;
  text: string;
  turn: number;
  checkResult?: CheckResult;
}

export interface Clue {
  id: string;
  title: string;
  detail: string;
  discoveredAtTurn: number;
  relatedTo?: string;
}

export interface QuestState {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  progress: number;
  steps: string[];
}

export interface NPCState {
  id: string;
  name: string;
  role: string;
  disposition: "friendly" | "neutral" | "wary" | "hostile" | "unknown";
  lastSeen: string;
  notes: string[];
}

export interface PlayerState {
  name: string;
  role: string;
  hp: number;
  stress: number;
  strengths: string[];
  weakness: string;
  inventory: string[];
  credits: number;
  ammo: number;
}

export interface WorldState {
  title: string;
  genre: string;
  tone: string;
  currentLocation: string;
  heat: number;
  dangerLevel: DangerLevel;
  quests: QuestState[];
  clues: Clue[];
  npcs: NPCState[];
  latestCheckResult?: CheckResult;
}

export interface GameState {
  id: string;
  turn: number;
  mode: AdventureMode;
  ruleStyle: RuleStyle;
  worldPackId: string;
  rulePackId: string;
  player: PlayerState;
  world: WorldState;
  messages: Message[];
}

export interface RunCreationInput {
  mode: AdventureMode;
  ruleStyle: RuleStyle;
  worldPackId: string;
  rulePackId: string;
  name: string;
  role: string;
  strengths: string[];
  weakness: string;
  startingItems: string[];
}

export interface WorldPack {
  id: string;
  title: string;
  genre: string;
  tone: string;
  openingScene: string;
  locations: string[];
  factions: string[];
  npcs: NPCState[];
  startingQuests: QuestState[];
  startingClues: Clue[];
}

export interface RulePack {
  id: string;
  title: string;
  mode: RuleMode;
  dice: string;
  skills: SkillName[];
  difficulties: Record<DifficultyLabel, number>;
  resources: string[];
}
