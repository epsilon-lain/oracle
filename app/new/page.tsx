import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { NewAdventureForm } from "@/components/NewAdventureForm";
import { neonLiteRulePack } from "@/lib/rule-packs";
import { neonRainAlleyWorldPack } from "@/lib/world-packs";

export default function NewAdventurePage() {
  return (
    <AuthGate nextPath="/new">
      <main className="min-h-screen bg-ink text-bone">
        <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-6 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <section className="flex flex-col justify-between border-r border-bone/10 pb-8 pr-0 lg:pr-8">
            <div>
              <Link href="/" className="text-sm uppercase tracking-[0.22em] text-rain">
                Oracle
              </Link>
              <h1 className="mt-12 text-4xl font-semibold sm:text-5xl">
                Start New Adventure
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-bone/72">
                Set the table, choose how much structure you want, and step into a
                remembered world.
              </p>
            </div>

            <div className="mt-10 space-y-5 border-t border-bone/12 pt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-bone/45">
                  Sample World Pack
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-rain">
                  {neonRainAlleyWorldPack.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-bone/70">
                  {neonRainAlleyWorldPack.genre} / {neonRainAlleyWorldPack.tone}
                </p>
                <p className="mt-4 text-sm leading-6 text-bone/84">
                  {neonRainAlleyWorldPack.openingScene}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-bone/45">
                  Sample Rule Pack
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-ember">
                  {neonLiteRulePack.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-bone/70">
                  {neonLiteRulePack.dice} / skills: {neonLiteRulePack.skills.join(", ")}
                </p>
              </div>
            </div>
          </section>

          <NewAdventureForm />
        </div>
      </main>
    </AuthGate>
  );
}
