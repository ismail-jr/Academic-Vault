// app/student/submissions/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSubmission } from "@/contexts/submission-context";
import { useSubmissionsFilter } from "@/hooks/useSubmissionsFilter";
import { Shield, Terminal, Badge as BadgeIcon } from "lucide-react";

import { Submission } from "@/contexts/submission-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/submissions/empty-state";
import { SubmissionCard } from "@/components/submissions/submission-card";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/submissions/stat-card";
import { SubmissionFilters } from "@/components/submissions/submission-filters";
import { SubmissionDetailDialog } from "@/components/submissions/submission-detail-dialog";

export default function SubmissionsPage() {
  const { token } = useAuth();
  const { submissions, isLoading, stats, fetchSubmissions } = useSubmission();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredSubmissions,
    hasFilters,
  } = useSubmissionsFilter(submissions);

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  };

  const handleDownload = async (submission: Submission) => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      setDownloadingId(submission._id);
      const res = await fetch(
        `${API_URL}/submissions/${submission._id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = submission.originalName + ".enc";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchSubmissions();
      toast.success("Refreshed");
    } catch {
      toast.error("Refresh failed");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Terminal Header */}
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
                ~/student/submissions
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Status: ONLINE | Submissions: {submissions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1 font-mono">
              <Shield className="size-3" />
              ENCRYPTED_VIEW
            </Badge>
            <button
              onClick={handleRefresh}
              className="text-xs px-3 py-1 rounded-md border border-primary/20 hover:bg-primary/10 transition-all font-mono"
            >
              {`>_ REFRESH`}
            </button>
          </div>
        </div>
      </div>

      <StatsCards stats={stats} />

      <SubmissionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filteredSubmissions.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSubmissions.map((submission) => (
            <SubmissionCard
              key={submission._id}
              submission={submission}
              onViewDetails={handleViewDetails}
              onDownload={handleDownload}
              isDownloading={downloadingId === submission._id}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((submission) => (
            <SubmissionCard
              key={submission._id}
              submission={submission}
              onViewDetails={handleViewDetails}
              onDownload={handleDownload}
              isDownloading={downloadingId === submission._id}
              viewMode="list"
            />
          ))}
        </div>
      )}

      <SubmissionDetailDialog
        submission={selectedSubmission}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onDownload={handleDownload}
      />

      {/* Footer */}
      <div className="text-center">
        <p className="text-[10px] font-mono text-muted-foreground">
          Showing {filteredSubmissions.length} of {submissions.length}{" "}
          submissions | VIEW_MODE: {viewMode.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
