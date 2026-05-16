// components/dashboard/empty-state.tsx
"use client";

import { Card } from "@/components/ui/card";
import { FileLock2 } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="rounded-2xl p-12 text-center border-primary/20">
      <FileLock2 className="mx-auto size-12 text-muted-foreground mb-4 opacity-30" />
      <p className="text-sm font-mono text-muted-foreground">
        NO_SUBMISSIONS_FOUND
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Try adjusting your filters
      </p>
    </Card>
  );
}
