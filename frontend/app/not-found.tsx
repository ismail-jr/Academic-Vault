// app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <AlertTriangle className="size-16 text-primary" />
          </div>
        </div>

        <h1 className="mb-2 font-mono text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 font-mono text-xl font-semibold">Page Not Found</h2>

        <p className="mb-8 max-w-md font-mono text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved to another
          vault.
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => router.back()}
            variant="default"
            className="gap-2 font-mono cursor-pointer hover:bg-primary/90 transition-all duration-200"
          >
            <ArrowLeft className="size-4" />
            GO_BACK
          </Button>

          <Button
            asChild
            variant="outline"
            className="gap-2 font-mono cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            <Link href="/">HOME</Link>
          </Button>
        </div>

        <p className="mt-8 font-mono text-[10px] text-muted-foreground">
          Error: Resource not found in academic vault
        </p>
      </div>
    </div>
  );
}
