import { neonLiteRulePack, rulePacks } from "@/lib/rule-packs";
import { neonRainAlleyWorldPack, worldPacks } from "@/lib/world-packs";
import type {
  CheckOutcome,
  CheckResult,
  Clue,
  DangerLevel,
  GameState,
  Message,
  NPCState,
  PlayerState,
  QuestState,
  RunCreationInput,
  SkillName,
  WorldState,
} from "@/lib/types";

export function createInitialGameState(): GameState {
  const worldPack = neonRainAlleyWorldPack;

  return {
    id: "local-mock-run",
    turn: 0,
    mode: "Import World Pack",
    ruleStyle: "Light Dice Rules",
    worldPackId: worldPack.id,
    rulePackId: neonLiteRulePack.id,
    player: {
      name: "Mara Venn",
      role: "street-level investigator",
      hp: 10,
      stress: 1,
      strengths: ["observant", "stubborn"],
      weakness: "answers every distress call",
      inventory: ["rain coat", "cracked phone", "pocket flashlight", "20 credits"],
      credits: 20,
      ammo: 0,
    },
    world: {
      title: worldPack.title,
      genre: worldPack.genre,
      tone: worldPack.tone,
      currentLocation: worldPack.locations[0],
      heat: 1,
      dangerLevel: "low",
      quests: cloneQuests(worldPack.startingQuests),
      clues: cloneClues(worldPack.startingClues),
      npcs: cloneNpcs(worldPack.npcs),
    },
    messages: [
      {
        id: "gm-0",
        speaker: "gm",
        turn: 0,
        text: `${worldPack.openingScene}\n\nRain ticks on the dumpster lid like a nervous metronome. The convenience store door hums behind you, and the alley camera above it turns away one degree too late.`,
      },
    ],
  };
}

export function createGameStateFromRun(input: RunCreationInput): GameState {
  const worldPack =
    worldPacks.find((candidate) => candidate.id === input.worldPackId) ?? neonRainAlleyWorldPack;
  const rulePack =
    rulePacks.find((candidate) => candidate.id === input.rulePackId) ?? neonLiteRulePack;
  const playerName = input.name.trim() || "Unnamed Seeker";
  const playerRole = input.role.trim() || "solo investigator";
  const strengths = input.strengths.length > 0 ? input.strengths : ["curious"];
  const inventory = input.startingItems.length > 0 ? input.startingItems : ["rain coat"];

  return {
    id: `local-run-${Date.now()}`,
    turn: 0,
    mode: input.mode,
    ruleStyle: input.ruleStyle,
    worldPackId: worldPack.id,
    rulePackId: rulePack.id,
    player: {
      name: playerName,
      role: playerRole,
      hp: 10,
      stress: 0,
      strengths,
      weakness: input.weakness.trim() || "unknown pressure",
      inventory,
      credits: 20,
      ammo: 0,
    },
    world: {
      title: worldPack.title,
      genre: worldPack.genre,
      tone: worldPack.tone,
      currentLocation: worldPack.locations[0],
      heat: 1,
      dangerLevel: "low",
      quests: cloneQuests(worldPack.startingQuests),
      clues: cloneClues(worldPack.startingClues),
      npcs: cloneNpcs(worldPack.npcs),
    },
    messages: [
      {
        id: "gm-0",
        speaker: "gm",
        turn: 0,
        text: `${worldPack.openingScene}\n\n${playerName}, rain ticks on the dumpster lid like a nervous metronome. The convenience store door hums behind you, and the alley camera above it turns away one degree too late.`,
      },
    ],
  };
}

export function advanceMockGame(current: GameState, playerInput: string): GameState {
  const turn = current.turn + 1;
  const normalizedInput = playerInput.trim();
  const checkResult = maybeCreateCheck(normalizedInput, turn, current.rulePackId);
  const nextWorld = updateWorldState(current.world, normalizedInput, turn, checkResult);
  const nextPlayer = updatePlayerState(current.player, normalizedInput, checkResult);
  const playerMessage: Message = {
    id: `player-${turn}`,
    speaker: "player",
    turn,
    text: normalizedInput,
  };
  const gmMessage: Message = {
    id: `gm-${turn}`,
    speaker: "gm",
    turn,
    text: composeGmResponse(normalizedInput, nextWorld, checkResult),
    checkResult,
  };

  return {
    ...current,
    turn,
    player: nextPlayer,
    world: nextWorld,
    messages: [...current.messages, playerMessage, gmMessage],
  };
}

function maybeCreateCheck(
  input: string,
  turn: number,
  rulePackId: string,
): CheckResult | undefined {
  const rulePack = rulePacks.find((candidate) => candidate.id === rulePackId) ?? neonLiteRulePack;

  if (rulePack.mode === "narrative") {
    return undefined;
  }

  if (!shouldTriggerCheck(input, turn)) {
    return undefined;
  }

  const skill = detectSkill(input);
  const difficultyLabel = input.length > 120 ? "hard" : turn % 4 === 0 ? "hard" : "normal";
  const target = rulePack.difficulties[difficultyLabel];
  const roll = (checksum(`${input}:${turn}`) % 10) + 1;
  const modifier = skill === "observe" || skill === "talk" ? 3 : 2;
  const total = roll + modifier;
  const outcome: CheckOutcome =
    total >= target ? "success" : total >= target - 3 ? "mixed" : "failure";
  const consequence =
    outcome === "success"
      ? "You gain ground without giving the alley much leverage."
      : outcome === "mixed"
        ? "You get what you need, but the city notices the shape of your question."
        : "The lead stays alive, but pressure finds you first.";

  return {
    id: `check-${turn}`,
    turn,
    skill,
    difficultyLabel,
    target,
    roll,
    modifier,
    total,
    outcome,
    consequence,
  };
}

function updateWorldState(
  world: WorldState,
  input: string,
  turn: number,
  checkResult?: CheckResult,
): WorldState {
  const lower = input.toLowerCase();
  const clues = [...world.clues];
  const npcs = cloneNpcs(world.npcs);
  let currentLocation = world.currentLocation;
  let heat = world.heat;

  if (includesAny(lower, ["look", "search", "observe", "inspect", "camera"])) {
    addClueOnce(clues, {
      id: "rain-smeared-tire-track",
      title: "Rain-smeared tire track",
      detail:
        "A narrow delivery scooter stopped here recently, but its rear tire left a medical-grade disinfectant smell.",
      discoveredAtTurn: turn,
      relatedTo: "dr-voss",
    });
  }

  if (includesAny(lower, ["phone", "hack", "signal", "message", "tech"])) {
    addClueOnce(clues, {
      id: "clinic-relay-ping",
      title: "Clinic relay ping",
      detail:
        "The doctor's last message bounced through an old tram maintenance router two blocks east.",
      discoveredAtTurn: turn,
      relatedTo: "dr-voss",
    });
    currentLocation = "Old tram maintenance door";
  }

  if (includesAny(lower, ["talk", "ask", "clerk", "vendor", "convince"])) {
    upsertNpcNote(npcs, {
      id: "mina-clerk",
      name: "Mina",
      role: "night clerk",
      disposition: "wary",
      lastSeen: "Convenience store counter",
      notes: ["Saw a spotless white sleeve at the alley mouth after midnight."],
    });
    heat += 1;
  }

  if (includesAny(lower, ["follow", "white suit", "tail", "shadow"])) {
    currentLocation = "Blue Lantern service lane";
    heat += 1;
    addClueOnce(clues, {
      id: "white-suit-cufflink",
      title: "White enamel cufflink",
      detail: "A chipped cufflink bears a private security crest filed almost smooth.",
      discoveredAtTurn: turn,
      relatedTo: "white-suit",
    });
  }

  if (includesAny(lower, ["fight", "force", "break", "shoot", "knife"])) {
    heat += 2;
  }

  if (checkResult?.outcome === "failure") {
    heat += 1;
  }

  const quests = updateQuestProgress(world.quests, clues, currentLocation);

  return {
    ...world,
    currentLocation,
    heat,
    dangerLevel: getDangerLevel(heat),
    quests,
    clues,
    npcs,
    latestCheckResult: checkResult ?? world.latestCheckResult,
  };
}

function updatePlayerState(
  player: PlayerState,
  input: string,
  checkResult?: CheckResult,
): PlayerState {
  const lower = input.toLowerCase();
  let stress = player.stress;
  let hp = player.hp;

  if (checkResult?.outcome === "failure" || checkResult?.outcome === "mixed") {
    stress += 1;
  }

  if (includesAny(lower, ["fight", "shoot", "knife"]) && checkResult?.outcome === "failure") {
    hp = Math.max(1, hp - 1);
  }

  return {
    ...player,
    hp,
    stress: Math.min(stress, 10),
  };
}

function composeGmResponse(input: string, world: WorldState, checkResult?: CheckResult) {
  const lower = input.toLowerCase();
  const opening = pick(
    [
      "The rain changes rhythm as if the alley is listening.",
      "Neon ripples across the puddles and turns every shadow into a suspect.",
      "Somewhere above you, a cheap sign buzzes through three bad electrical decisions.",
    ],
    input,
  );
  const memoryLine = `Oracle marks the table: location is now ${world.currentLocation}; heat is ${world.heat}.`;

  let resultLine =
    "Your move presses into the silence. Nothing breaks open yet, but the world shifts around the pressure.";

  if (includesAny(lower, ["look", "search", "observe", "inspect", "camera"])) {
    resultLine =
      "You slow down and let the alley confess in pieces: tire grit, camera lag, disinfectant under the rain.";
  }

  if (includesAny(lower, ["talk", "ask", "clerk", "vendor", "convince"])) {
    resultLine =
      "Mina keeps one hand under the counter while she talks. Her eyes flick to the alley camera before she mentions the white sleeve.";
  }

  if (includesAny(lower, ["phone", "hack", "signal", "message", "tech"])) {
    resultLine =
      "The cracked phone coughs up a relay path: old tram hardware, still alive, still forwarding secrets in the dark.";
  }

  if (includesAny(lower, ["follow", "white suit", "tail", "shadow"])) {
    resultLine =
      "You catch a pale reflection moving where no person is standing. The trail leads out of the alley and toward the Blue Lantern service lane.";
  }

  if (includesAny(lower, ["fight", "force", "break", "shoot", "knife"])) {
    resultLine =
      "The alley answers force with volume. Metal rings, someone swears behind glass, and the night begins to point at you.";
  }

  const checkLine = checkResult
    ? `\n\nCheck result: d10 roll ${checkResult.roll} + ${checkResult.skill} ${checkResult.modifier} = ${checkResult.total} vs ${checkResult.target}. ${checkResult.consequence}`
    : "";

  return `${opening} ${resultLine}\n\n${memoryLine}${checkLine}`;
}

function shouldTriggerCheck(input: string, turn: number) {
  const lower = input.toLowerCase();
  const riskyWords = [
    "hack",
    "sneak",
    "fight",
    "shoot",
    "convince",
    "follow",
    "force",
    "break",
    "search",
    "observe",
    "tail",
  ];

  return includesAny(lower, riskyWords) || (input.length > 60 && turn % 2 === 0);
}

function detectSkill(input: string): SkillName {
  const lower = input.toLowerCase();

  if (includesAny(lower, ["hack", "phone", "signal", "camera", "relay", "tech"])) {
    return "tech";
  }

  if (includesAny(lower, ["sneak", "hide", "tail", "follow", "shadow"])) {
    return "stealth";
  }

  if (includesAny(lower, ["talk", "ask", "convince", "lie", "bargain"])) {
    return "talk";
  }

  if (includesAny(lower, ["fight", "shoot", "knife", "punch", "force"])) {
    return "fight";
  }

  return "observe";
}

function updateQuestProgress(quests: QuestState[], clues: Clue[], currentLocation: string) {
  return quests.map((quest) => {
    if (quest.id !== "find-voss" || quest.status !== "active") {
      return quest;
    }

    const clueProgress = Math.min(55, clues.length * 12);
    const locationProgress = currentLocation === "Old tram maintenance door" ? 20 : 0;
    const progress = Math.min(95, 10 + clueProgress + locationProgress);

    return {
      ...quest,
      progress,
    };
  });
}

function getDangerLevel(heat: number): DangerLevel {
  if (heat >= 7) {
    return "critical";
  }

  if (heat >= 5) {
    return "high";
  }

  if (heat >= 3) {
    return "rising";
  }

  return "low";
}

function addClueOnce(clues: Clue[], clue: Clue) {
  if (!clues.some((existingClue) => existingClue.id === clue.id)) {
    clues.push(clue);
  }
}

function upsertNpcNote(npcs: NPCState[], npc: NPCState) {
  const existingNpc = npcs.find((candidate) => candidate.id === npc.id);

  if (!existingNpc) {
    npcs.push(npc);
    return;
  }

  for (const note of npc.notes) {
    if (!existingNpc.notes.includes(note)) {
      existingNpc.notes.push(note);
    }
  }

  existingNpc.disposition = npc.disposition;
  existingNpc.lastSeen = npc.lastSeen;
}

function includesAny(value: string, fragments: string[]) {
  return fragments.some((fragment) => value.includes(fragment));
}

function pick(options: string[], seed: string) {
  return options[checksum(seed) % options.length];
}

function checksum(value: string) {
  return Array.from(value).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0,
  );
}

function cloneQuests(quests: QuestState[]) {
  return quests.map((quest) => ({
    ...quest,
    steps: [...quest.steps],
  }));
}

function cloneClues(clues: Clue[]) {
  return clues.map((clue) => ({ ...clue }));
}

function cloneNpcs(npcs: NPCState[]) {
  return npcs.map((npc) => ({
    ...npc,
    notes: [...npc.notes],
  }));
}
