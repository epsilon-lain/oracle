import Link from "next/link";
import type { ReactNode } from "react";

type AuthFormShellProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerLinkText: string;
};

const localDemoWarning =
  "This is a local demo. Accounts and saves are stored only on this machine. Do not use a real or commonly reused password.";

export function AuthFormShell({
  title,
  eyebrow,
  children,
  footerText,
  footerHref,
  footerLinkText,
}: AuthFormShellProps) {
  return (
    <main className="min-h-screen bg-ink text-bone">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-6 py-8 lg:grid-cols-[0.85fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="text-sm uppercase tracking-[0.24em] text-rain">
            Oracle
          </Link>
          <p className="mt-16 text-xs uppercase tracking-[0.3em] text-rain">{eyebrow}</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-bone/72">
            Keep the room local for now. Sign in, set the table, and let the alley remember
            what you discover.
          </p>
        </div>

        <section className="border border-bone/12 bg-smoke/88 p-5 shadow-glow sm:p-7">
          <div className="mb-6 border border-ember/35 bg-ember/10 px-4 py-3 text-sm leading-6 text-bone/82">
            {localDemoWarning}
          </div>

          {children}

          <p className="mt-6 border-t border-bone/10 pt-5 text-sm text-bone/62">
            {footerText}{" "}
            <Link href={footerHref} className="font-semibold text-rain hover:text-bone">
              {footerLinkText}
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
