import { HomeActionButtons } from "@/components/HomeActionButtons";
import { HomeAuthControls } from "@/components/HomeAuthControls";

const tagline =
  "A solo role-playing and story-building engine where your worlds remember you.";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink text-bone">
      <section className="relative isolate min-h-screen overflow-hidden bg-[url('/neon-rain-alley.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,10,13,0.94)_0%,rgba(9,10,13,0.72)_46%,rgba(9,10,13,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_28%,rgba(111,209,213,0.22),transparent_24rem)]" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between text-sm uppercase tracking-[0.28em] text-bone/70">
            <span>Oracle</span>
            <div className="flex items-center gap-5">
              <span className="hidden text-rain lg:inline">World Memory Online</span>
              <HomeAuthControls />
            </div>
          </header>

          <div className="max-w-2xl py-16">
            <p className="mb-5 text-sm uppercase tracking-[0.3em] text-rain">
              Solo tabletop room
            </p>
            <h1 className="text-6xl font-semibold leading-none text-bone sm:text-7xl lg:text-8xl">
              Oracle
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-bone/84 sm:text-xl">
              {tagline}
            </p>

            <div className="mt-10">
              <HomeActionButtons />
            </div>
          </div>

          <div className="grid gap-3 border-t border-bone/15 py-4 text-sm text-bone/76 sm:grid-cols-3">
            <p>
              Case file: <span className="text-bone">Neon Rain Alley</span>
            </p>
            <p>
              Last warning: <span className="text-signal">Do not trust the white suit.</span>
            </p>
            <p>
              Memory: <span className="text-moss">Every clue stays on the table.</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
