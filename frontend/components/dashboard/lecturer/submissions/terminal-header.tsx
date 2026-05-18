// components/dashboard/terminal-header.tsx
"use client";

import { Terminal, Shield, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TerminalHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
}

export function TerminalHeader({
  title,
  subtitle,
  badgeText = "ENCRYPTED_VIEW",
  onRefresh,
  isRefreshing = false,
}: TerminalHeaderProps) {
  const handleRefresh = async () => {
    if (!onRefresh) return;

    try {
      await onRefresh();
      toast.success("Refreshed successfully");
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Refresh failed");
    }
  };

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

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1 font-mono">
            <Shield className="size-3" />
            {badgeText}
          </Badge>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 font-mono text-xs"
            >
              <RefreshCw
                className={cn("size-3", isRefreshing && "animate-spin")}
              />
              {isRefreshing ? "REFRESHING..." : ">_ REFRESH"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
