// components/dashboard/lecturer/details/terminal-header.tsx
"use client";

import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TerminalHeaderProps {
  submissionId: string;
}

export function DetailsTerminalHeader({ submissionId }: TerminalHeaderProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-lg" />
      <div className="relative flex items-center justify-between p-4 border border-primary/20 rounded-lg bg-black/5 dark:bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <Terminal className="size-5 text-primary" />
          <div>
            <h1 className="text-lg font-semibold tracking-tight font-mono">
              ~/lecturer/submissions/{submissionId.slice(-8)}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              REVIEW_MODE: ACTIVE | ENCRYPTION: VERIFIED
            </p>
          </div>
        </div>
        <Link href="/lecturer/submissions">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 font-mono text-xs"
          >
            <ArrowLeft className="size-3" />
            BACK
          </Button>
        </Link>
      </div>
    </div>
  );
}
