// components/submissions/StatsCards.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileLock2, Clock, Eye, CheckCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubmissionStats } from "@/contexts/submission-context";

interface StatsCardsProps {
  stats: SubmissionStats;
}

const statConfigs = [
  {
    key: "total",
    label: "TOTAL_SUBMISSIONS",
    icon: FileLock2,
    color: "blue",
    trend: "+12%",
  },
  {
    key: "pending",
    label: "PENDING_REVIEW",
    icon: Clock,
    color: "yellow",
    trend: "-3%",
  },
  {
    key: "viewed",
    label: "VIEWED",
    icon: Eye,
    color: "purple",
    trend: "+5%",
  },
  {
    key: "graded",
    label: "GRADED",
    icon: CheckCircle,
    color: "green",
    trend: "+8%",
  },
];

const colorClasses = {
  blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
  yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
  purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
  green: "from-green-500/10 to-green-500/5 border-green-500/20",
};

const iconColors = {
  blue: "text-blue-500",
  yellow: "text-yellow-500",
  purple: "text-purple-500",
  green: "text-green-500",
};

const badgeColors = {
  blue: "border-blue-500/20 text-blue-500",
  yellow: "border-yellow-500/20 text-yellow-500",
  purple: "border-purple-500/20 text-purple-500",
  green: "border-green-500/20 text-green-500",
};

export function StatsCards({ stats }: StatsCardsProps) {
  const values = {
    total: stats.total,
    pending: stats.pending,
    viewed: stats.viewed,
    graded: stats.graded,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfigs.map((config) => {
        const Icon = config.icon;
        return (
          <Card
            key={config.key}
            className={cn(
              "rounded-2xl p-5 bg-gradient-to-br border overflow-hidden relative group",
              colorClasses[config.color as keyof typeof colorClasses],
            )}
          >
            <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    "size-10 rounded-xl bg-background/50 flex items-center justify-center",
                    iconColors[config.color as keyof typeof iconColors],
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-mono",
                    badgeColors[config.color as keyof typeof badgeColors],
                  )}
                >
                  {config.trend}
                </Badge>
              </div>
              <p className="text-2xl font-bold font-mono tracking-tight">
                {values[config.key as keyof typeof values]}
              </p>
              <p className="mt-1 text-[10px] font-mono text-muted-foreground tracking-wider">
                {config.label}
              </p>
              {config.key === "graded" && stats.averageGrade > 0 && (
                <p className="text-[9px] font-mono text-green-500/70 mt-1">
                  AVG: {stats.averageGrade}%
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
