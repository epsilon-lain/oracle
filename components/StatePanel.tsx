import type { GameState } from "@/lib/types";

type StatePanelProps = {
  gameState: GameState;
};

export function StatePanel({ gameState }: StatePanelProps) {
  const { player, world } = gameState;

  return (
    <aside className="bg-smoke px-5 py-5 text-sm text-bone/78 lg:min-h-screen">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-rain">Persistent State</p>
        <h2 className="mt-2 text-2xl font-semibold text-bone">{player.name}</h2>
        <p className="mt-1 text-bone/55">{player.role}</p>
      </div>

      <section className="border-t border-bone/10 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-bone/45">
          Character
        </h3>
        <dl className="mt-3 grid grid-cols-3 gap-3">
          <Stat label="HP" value={player.hp} />
          <Stat label="Stress" value={player.stress} />
          <Stat label="Heat" value={world.heat} />
        </dl>
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-bone/45">Inventory</p>
          <p className="mt-2 leading-6">{player.inventory.join(", ")}</p>
        </div>
      </section>

      <section className="border-t border-bone/10 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-bone/45">
          World
        </h3>
        <dl className="mt-3 grid gap-3">
          <Detail label="Current Location" value={world.currentLocation} />
          <Detail label="Danger Level" value={world.dangerLevel} />
        </dl>
      </section>

      <StateList
        title="Active Quests"
        items={world.quests
          .filter((quest) => quest.status === "active")
          .map((quest) => `${quest.title} (${quest.progress}%)`)}
      />
      <StateList title="Clues" items={world.clues.map((clue) => clue.title)} />
      <StateList
        title="NPC Notes"
        items={world.npcs.map((npc) => `${npc.name}: ${npc.notes.join("; ")}`)}
      />

      <section className="border-t border-bone/10 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-bone/45">
          Latest Check Result
        </h3>
        {world.latestCheckResult ? (
          <p className="mt-3 leading-6 text-ember">
            {world.latestCheckResult.skill}: {world.latestCheckResult.total} vs{" "}
            {world.latestCheckResult.target}, {world.latestCheckResult.outcome}
          </p>
        ) : (
          <p className="mt-3 leading-6 text-bone/52">No check yet.</p>
        )}
      </section>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-bone/10 bg-ink/55 p-3">
      <dt className="text-xs uppercase tracking-[0.16em] text-bone/40">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-bone">{value}</dd>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.16em] text-bone/40">{label}</dt>
      <dd className="mt-1 leading-6 text-bone/82">{value}</dd>
    </div>
  );
}

function StateList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border-t border-bone/10 py-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-bone/45">
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="leading-6">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 leading-6 text-bone/52">None yet.</p>
      )}
    </section>
  );
}
