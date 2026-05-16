// components/dashboard/student-dashboard.tsx (updated)
"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "../protected-routes";
import { useAuth } from "@/contexts/auth-context";
import { useSubmission, Submission } from "@/contexts/submission-context";
import { StudentTerminalHeader } from "./student/terminal-header";
import { StudentStatsGrid } from "./student/stats-grid";
import { StudentQuickActions } from "./student/quick-actions";
import { StudentRecentSubmissions } from "./student/recent-submissions";
import { SecurityNotice } from "./student/security-notice";
import { Button } from "../ui/button";

export function StudentDashboard() {
  const { token, user } = useAuth();
  const { submissions, fetchSubmissions, isLoading } = useSubmission();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    gradedCount: 0,
    pendingCount: 0,
    viewedCount: 0,
    averageGrade: 0,
    notificationsCount: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    try {
      await fetchSubmissions();

      const graded = submissions.filter(
        (s) => s.status === "graded" && s.grade,
      );
      const pending = submissions.filter(
        (s) => s.status === "submitted" || s.status === "encrypted",
      );
      const avgGrade =
        graded.length > 0
          ? graded.reduce((acc, s) => acc + (s.grade || 0), 0) / graded.length
          : 0;
      const unreadNotifications = submissions.filter(
        (s) => s.status === "viewed" && !s.feedback,
      );

      setStats({
        totalSubmissions: submissions.length,
        gradedCount: graded.length,
        pendingCount: pending.length,
        viewedCount: submissions.filter((s) => s.status === "viewed").length,
        averageGrade: Math.round(avgGrade),
        notificationsCount: unreadNotifications.length,
      });

      // Show only 3 most recent submissions
      setRecentSubmissions(submissions.slice(0, 3));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  if (isLoading && !submissions.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="space-y-8">
        <StudentTerminalHeader
          userName={user?.name?.split(" ")[0] || "Student"}
        />

        <StudentStatsGrid
          totalSubmissions={stats.totalSubmissions}
          gradedCount={stats.gradedCount}
          pendingCount={stats.pendingCount}
          notificationsCount={stats.notificationsCount}
          averageGrade={stats.averageGrade}
        />

        <StudentQuickActions />

        {/* Recent Submissions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-mono">
              RECENT_SUBMISSIONS
            </h2>
            <Link href="/student/submissions">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-mono text-xs"
              >
                VIEW_ALL ({submissions.length}){" "}
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
          <StudentRecentSubmissions submissions={recentSubmissions} />
        </div>

        <SecurityNotice />
      </div>
    </ProtectedRoute>
  );
}
