// components/dashboard/student/empty-state.tsx
"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileLock2, ArrowRight } from "lucide-react";

export function StudentEmptyState() {
  return (
    <Card className="rounded-2xl p-12 text-center border-primary/20">
      <FileLock2 className="mx-auto size-12 text-muted-foreground mb-4 opacity-30" />
      <p className="text-sm font-mono text-muted-foreground">
        NO_SUBMISSIONS_FOUND
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Submit your first assignment
      </p>
      <Link href="/student/submit">
        <Button variant="link" className="mt-4 gap-2 font-mono text-xs">
          SUBMIT_NOW <ArrowRight className="size-3" />
        </Button>
      </Link>
    </Card>
  );
}
