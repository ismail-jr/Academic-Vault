"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("auth/register");
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 encrypted-overlay opacity-60" />

      <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      {/* Loading state */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="glow-trust flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl border border-primary/20 bg-card shadow-card">
          <div className="h-6 w-6 rounded-full bg-primary" />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Redirecting to Vault
          </h1>

          <p className="max-w-sm text-sm text-muted-foreground">
            Initializing secure authentication environment...
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          Zero-Trust Session Active
        </div>
      </div>
    </main>
  );
}
