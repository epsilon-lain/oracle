import type { WorldPack } from "@/lib/types";

export const neonRainAlleyWorldPack: WorldPack = {
  id: "neon-rain-alley",
  title: "Neon Rain Alley",
  genre: "cyberpunk noir",
  tone: "rainy, tense, intimate, mysterious",
  openingScene:
    'The player stands behind a convenience store in a neon-lit alley. A missing underground doctor sent one final message: "Do not trust the white suit."',
  locations: [
    "Convenience store back alley",
    "Blue Lantern service lane",
    "Flooded clinic stairwell",
    "Old tram maintenance door",
  ],
  factions: ["back-alley medics", "private security contractors", "street vendors"],
  npcs: [
    {
      id: "dr-voss",
      name: "Dr. Ilya Voss",
      role: "missing underground doctor",
      disposition: "unknown",
      lastSeen: "Flooded clinic stairwell",
      notes: ["Sent the final warning about the white suit."],
    },
    {
      id: "white-suit",
      name: "The White Suit",
      role: "unknown watcher",
      disposition: "hostile",
      lastSeen: "reflected in alley glass",
      notes: ["Connected to the final message."],
    },
  ],
  startingQuests: [
    {
      id: "find-voss",
      title: "Find the missing doctor",
      description:
        "Trace Dr. Voss through the alley, the clinic, and whoever wears the white suit.",
      status: "active",
      progress: 10,
      steps: ["Read the final message", "Search the alley", "Identify the white suit"],
    },
  ],
  startingClues: [
    {
      id: "final-message",
      title: "Final message",
      detail: '"Do not trust the white suit."',
      discoveredAtTurn: 0,
      relatedTo: "dr-voss",
    },
  ],
};

export const worldPacks = [neonRainAlleyWorldPack];
