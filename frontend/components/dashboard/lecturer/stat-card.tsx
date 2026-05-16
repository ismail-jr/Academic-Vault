// components/dashboard/stat-card.tsx (updated with more flexibility)
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  color?: "blue" | "green" | "yellow" | "purple" | "cyan" | "emerald";
}

const colorClasses = {
  blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
  green: "from-green-500/10 to-green-500/5 border-green-500/20",
  yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
  purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
  cyan: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20",
  emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
};

const iconColors = {
  blue: "text-blue-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
  purple: "text-purple-500",
  cyan: "text-cyan-500",
  emerald: "text-emerald-500",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = "blue",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl p-5 bg-gradient-to-br border overflow-hidden relative group",
        colorClasses[color],
      )}
    >
      <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              "size-10 rounded-xl bg-background/50 flex items-center justify-center",
              iconColors[color],
            )}
          >
            <Icon className="size-5" />
          </div>
          {trend && (
            <Badge
              variant="outline"
              className={cn("text-[10px] font-mono", iconColors[color])}
            >
              {trend}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
        <p className="mt-1 text-[10px] font-mono text-muted-foreground tracking-wider">
          {label}
        </p>
      </div>
    </Card>
  );
}
