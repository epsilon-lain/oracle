import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function AuthFormFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-bone">
      <div className="border border-bone/12 bg-smoke px-6 py-5 text-sm text-bone/70">
        Opening login...
      </div>
    </main>
  );
}
