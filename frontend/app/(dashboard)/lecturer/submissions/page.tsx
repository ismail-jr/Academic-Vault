// app/lecturer/submissions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import {
  Loader2,
  FileLock2,
  Clock,
  Eye,
  CheckCircle,
  LayoutGrid,
  Rows,
} from "lucide-react";

import { TerminalHeader } from "@/components/dashboard/lecturer/submissions/terminal-header";
import { PipelineProgress } from "@/components/dashboard/lecturer/submissions/pipeline-progress";
import { StatusTabs } from "@/components/dashboard/lecturer/submissions/status-tabs";
import { EmptyState } from "@/components/dashboard/lecturer/submissions/empty-state";
import { SubmissionFilters } from "@/components/dashboard/lecturer/submissions/submission-filters";
import { StatCard } from "@/components/dashboard/lecturer/stat-card";
import { Button } from "@/components/ui/button";
import { SubmissionCard } from "@/components/dashboard/lecturer/submissions/submission-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ViewMode = "grid" | "list";

interface Submission {
  _id: string;
  student: { name: string; email: string; studentId?: string };
  lecturer: { name: string; email: string };
  originalName: string;
  filePath: string;
  status: "submitted" | "encrypted" | "viewed" | "graded";
  grade?: number;
  feedback?: string;
  courseCode?: string;
  courseName?: string;
  assignmentTitle?: string;
  description?: string;
  createdAt: string;
  encryptedKey?: string;
  iv?: string;
}

export default function LecturerSubmissionsPage() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    viewed: 0,
    graded: 0,
  });

  const courses = Array.from(
    new Set(submissions.map((s) => s.courseCode).filter(Boolean)),
  );

  useEffect(() => {
    if (token) fetchSubmissions();
  }, [token]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/submissions/lecturer/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error("Fetch failed");
      setSubmissions(data.submissions);
      const subs = data.submissions;
      setStats({
        total: subs.length,
        pending: subs.filter(
          (s: Submission) =>
            s.status === "submitted" || s.status === "encrypted",
        ).length,
        viewed: subs.filter((s: Submission) => s.status === "viewed").length,
        graded: subs.filter((s: Submission) => s.status === "graded").length,
      });
    } catch {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = submissions
    .filter((s) => {
      const matchSearch =
        s.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.assignmentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.courseCode?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchCourse =
        courseFilter === "all" || s.courseCode === courseFilter;
      return matchSearch && matchStatus && matchCourse;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TerminalHeader
        title="~/lecturer/submissions"
        subtitle={`Status: ONLINE | Submissions: ${stats.total}`}
        onRefresh={fetchSubmissions}
        isRefreshing={loading}
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
          icon={Clock}
          label="PENDING_REVIEW"
          value={String(stats.pending)}
          trend="-3%"
          color="yellow"
        />
        <StatCard
          icon={Eye}
          label="VIEWED"
          value={String(stats.viewed)}
          trend="+5%"
          color="purple"
        />
        <StatCard
          icon={CheckCircle}
          label="GRADED"
          value={String(stats.graded)}
          trend="+8%"
          color="green"
        />
      </div>

      {/* <PipelineProgress graded={stats.graded} total={stats.total} /> */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SubmissionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          courseFilter={courseFilter}
          onCourseChange={setCourseFilter}
          courses={courses as string[]}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* View Toggle Buttons */}
        <div className="flex gap-2 shrink-0">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="gap-2"
          >
            <LayoutGrid className="size-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-2"
          >
            <Rows className="size-4" />
            List
          </Button>
        </div>
      </div>

      <StatusTabs onStatusChange={setStatusFilter} />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : viewMode === "grid" ? (
        // Grid View - 2 cards per row
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((submission) => (
            <SubmissionCard
              key={submission._id}
              submission={submission}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        // List View - Single column
        <div className="space-y-3">
          {filtered.map((submission) => (
            <SubmissionCard
              key={submission._id}
              submission={submission}
              viewMode="list"
            />
          ))}
        </div>
      )}

      <div className="text-center">
        <p className="text-[10px] font-mono text-muted-foreground">
          Showing {filtered.length} of {submissions.length} submissions |
          VIEW_MODE: {viewMode.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
