// components/dashboard/student/stats-grid.tsx
"use client";

import { FileLock2, CheckCircle2, Clock3, Bell } from "lucide-react";
import { StatCard } from "@/components/dashboard/lecturer/stat-card";

interface StatsGridProps {
  totalSubmissions: number;
  gradedCount: number;
  pendingCount: number;
  notificationsCount: number;
  averageGrade: number;
}

export function StudentStatsGrid({
  totalSubmissions,
  gradedCount,
  pendingCount,
  notificationsCount,
  averageGrade,
}: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={FileLock2}
        label="TOTAL_SUBMISSIONS"
        value={String(totalSubmissions)}
        trend="+8%"
        color="blue"
      />
      <StatCard
        icon={CheckCircle2}
        label="GRADED"
        value={String(gradedCount)}
        trend={averageGrade > 0 ? `AVG: ${averageGrade}%` : undefined}
        color="green"
      />
      <StatCard
        icon={Clock3}
        label="PENDING_REVIEW"
        value={String(pendingCount)}
        trend="-2%"
        color="yellow"
      />
      <StatCard
        icon={Bell}
        label="NOTIFICATIONS"
        value={String(notificationsCount)}
        trend="+3"
        color="purple"
      />
    </div>
  );
}
