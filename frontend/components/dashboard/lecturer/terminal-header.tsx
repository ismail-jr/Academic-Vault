// components/dashboard/terminal-header.tsx
"use client";

import { Terminal, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TerminalHeaderProps {
  title: string;
  subtitle: string;
}

export function TerminalHeader({ title, subtitle }: TerminalHeaderProps) {
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
              {title}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              {subtitle}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1 font-mono">
          <Shield className="size-3" />
          SECURE_CONNECTION
        </Badge>
      </div>
    </div>
  );
}
