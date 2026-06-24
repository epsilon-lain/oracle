"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export function HomeAuthControls() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  if (isLoading) {
    return <span className="text-bone/45">Checking session</span>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-bone/70 transition hover:text-rain">
          Log in
        </Link>
        <Link href="/register" className="text-rain transition hover:text-bone">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="max-w-36 truncate text-rain">{user?.username}</span>
      <button type="button" onClick={logout} className="text-bone/70 transition hover:text-rain">
        Logout
      </button>
    </div>
  );
}
