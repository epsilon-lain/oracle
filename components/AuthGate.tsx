"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/components/AuthProvider";

type AuthGateProps = {
  children: ReactNode;
  nextPath: string;
};

export function AuthGate({ children, nextPath }: AuthGateProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-6 text-bone">
        <div className="border border-bone/12 bg-smoke px-6 py-5 text-sm text-bone/70">
          Checking your local session...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-6 text-bone">
        <section className="w-full max-w-md border border-bone/12 bg-smoke/90 p-6 shadow-glow">
          <p className="text-xs uppercase tracking-[0.24em] text-rain">Oracle locked</p>
          <h1 className="mt-4 text-3xl font-semibold">Sign in to begin your adventure.</h1>
          <p className="mt-4 text-sm leading-6 text-bone/68">
            This local table keeps accounts and saves on this machine only.
          </p>
          <Link
            href={loginHref}
            className="mt-6 inline-flex items-center justify-center border border-rain bg-rain px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-bone"
          >
            Log in
          </Link>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
