import { Suspense } from "react";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <RegisterForm />
    </Suspense>
  );
}

function AuthFormFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-bone">
      <div className="border border-bone/12 bg-smoke px-6 py-5 text-sm text-bone/70">
        Opening registration...
      </div>
    </main>
  );
}
