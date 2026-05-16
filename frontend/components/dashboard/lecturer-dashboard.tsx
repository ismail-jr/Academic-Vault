// app/lecturer/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  FileLock2,
  CheckCircle2,
  Clock3,
  Bell,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-routes";
import { useAuth } from "@/contexts/auth-context";
import {
  UnderDevelopmentDialog,
  useUnderDevelopment,
} from "@/components/ui/under-development";
import { TerminalHeader } from "./lecturer/terminal-header";
import { StatCard } from "./lecturer/stat-card";
import { ActionCard } from "./lecturer/action-card";
import { RecentSubmissionsCard } from "./lecturer/recent-submissions-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Submission {
  _id: string;
  student: { name: string; email: string };
  courseCode?: string;
  courseName?: string;
  assignmentTitle?: string;
  status: "submitted" | "encrypted" | "viewed" | "graded";
  createdAt: string;
}

export default function LecturerDashboard() {
  const { token } = useAuth();
  const { openDialog } = useUnderDevelopment();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);

  const fetchRecent = async () => {
    try {
      if (!token) return;
      setLoading(true);
      const res = await fetch(`${API_URL}/submissions/lecturer/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setAllSubmissions(data.submissions || []);
      setSubmissions((data.submissions || []).slice(0, 3));
    } catch (err) {
      console.error(err);
      setSubmissions([]);
      setAllSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, [token]);

  const stats = {
    total: allSubmissions.length,
    reviewed: allSubmissions.filter((s) => s.status === "graded").length,
    pending: allSubmissions.filter(
      (s) => s.status === "submitted" || s.status === "encrypted",
    ).length,
    alerts: allSubmissions.filter((s) => s.status === "submitted").length,
  };

  const handleAnalyticsClick = () => {
    openDialog();
  };

  const handleStudentsClick = () => {
    openDialog();
  };

  return (
    <ProtectedRoute>
      <UnderDevelopmentDialog />
      <div className="space-y-8">
        <TerminalHeader
          title="~/lecturer/dashboard"
          subtitle="Status: ONLINE | Role: LECTURER | Access: GRANTED"
        />

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={FileLock2}
            label="TOTAL_SUBMISSIONS"
            value={String(stats.total)}
            trend="+12%"
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="REVIEWED"
            value={String(stats.reviewed)}
            trend="+5%"
            color="green"
          />
          <StatCard
            icon={Clock3}
            label="PENDING_REVIEW"
            value={String(stats.pending)}
            trend="-3%"
            color="yellow"
          />
          <StatCard
            icon={Bell}
            label="NEW_ALERTS"
            value={String(stats.alerts)}
            trend="+2"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          <ActionCard
            icon={Eye}
            title="Review Submissions"
            description="Grade pending student assignments"
            href="/lecturer/submissions"
            color="primary"
          />
          <ActionCard
            icon={TrendingUp}
            title="Analytics"
            description="View submission statistics"
            href="#"
            color="blue"
            disabled={true}
            onClick={handleAnalyticsClick}
          />
          <ActionCard
            icon={Users}
            title="Students"
            description="Manage enrolled students"
            href="#"
            color="purple"
            disabled={true}
            onClick={handleStudentsClick}
          />
        </div>

        {/* Recent Submissions */}
        <RecentSubmissionsCard
          submissions={submissions}
          allSubmissionsCount={allSubmissions.length}
          loading={loading}
          reviewedCount={stats.reviewed}
          totalCount={stats.total}
        />
      </div>
    </ProtectedRoute>
  );
}
