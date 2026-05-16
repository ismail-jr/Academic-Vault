// components/dashboard/lecturer/details/loading-state.tsx
"use client";

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="mt-4 text-sm font-mono text-muted-foreground">
          LOADING_SUBMISSION...
        </p>
      </div>
    </div>
  );
}
