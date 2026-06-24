"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthFormShell } from "@/components/AuthFormShell";
import { InlineError } from "@/components/InlineError";
import { useAuth } from "@/components/AuthProvider";
import { getSafeNextPath } from "@/lib/routes";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = login({
      email: readString(formData, "email"),
      password: readString(formData, "password"),
    });

    if (!result.ok) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(getSafeNextPath(searchParams.get("next"), "/new"));
  }

  return (
    <AuthFormShell
      title="Enter Oracle"
      eyebrow="Local login"
      footerText="No account yet?"
      footerHref="/register"
      footerLinkText="Register"
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-2 text-sm text-bone/72">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="border border-bone/12 bg-ink px-3 py-3 text-bone outline-none transition placeholder:text-bone/30 focus:border-rain focus:ring-2 focus:ring-rain/25"
          />
        </label>
        <label className="grid gap-2 text-sm text-bone/72">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="border border-bone/12 bg-ink px-3 py-3 text-bone outline-none transition placeholder:text-bone/30 focus:border-rain focus:ring-2 focus:ring-rain/25"
          />
        </label>

        <InlineError message={formError} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 border border-rain bg-rain px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-bone disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Entering..." : "Enter Oracle"}
        </button>
      </form>
    </AuthFormShell>
  );
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
