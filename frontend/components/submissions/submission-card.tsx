"use client";

import { useState } from "react";

import { Submission } from "@/contexts/submission-context";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import {
  Eye,
  Download,
  Lock,
  Shield,
  Clock,
  CheckCircle2,
  User,
  BookOpen,
  Calendar,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { DownloadEncryptedDialog } from "../download-encrypted-dialog";

interface Props {
  submission: Submission;
  onViewDetails: (s: Submission) => void;
  onDownload: (s: Submission) => void;
  isDownloading?: boolean;
  viewMode?: "grid" | "list";
}

const statusConfig = {
  submitted: {
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    label: "PENDING",
    icon: Clock,
  },

  encrypted: {
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    label: "ENCRYPTED",
    icon: Lock,
  },

  viewed: {
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    label: "VIEWED",
    icon: Eye,
  },

  graded: {
    color: "bg-green-500/10 text-green-600 border-green-200",
    label: "GRADED",
    icon: CheckCircle2,
  },

  returned: {
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
    label: "RETURNED",
    icon: CheckCircle2,
  },
};

const getStatusConfig = (status: string) => {
  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted
  );
};

export function SubmissionCard({
  submission,
  onViewDetails,
  onDownload,
  isDownloading = false,
  viewMode = "grid",
}: Props) {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const config = getStatusConfig(submission.status);

  const StatusIcon = config.icon;

  // ================= GRID VIEW =================
  if (viewMode === "grid") {
    return (
      <>
        <DownloadEncryptedDialog
          open={downloadDialogOpen}
          onOpenChange={setDownloadDialogOpen}
          isDownloading={isDownloading}
          fileName={submission.originalName}
          onConfirm={() => {
            onDownload(submission);
            setDownloadDialogOpen(false);
          }}
        />

        <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative flex h-full flex-col p-6">
            {/* TOP */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={cn(
                    "gap-1 rounded-md border font-mono text-[10px]",
                    config.color,
                  )}
                >
                  <StatusIcon className="size-3" />
                  {config.label}
                </Badge>

                <Badge
                  variant="outline"
                  className="gap-1 rounded-md font-mono text-[10px]"
                >
                  <Shield className="size-3" />
                  AES-256
                </Badge>
              </div>

              {submission.grade !== undefined && (
                <Badge className="gap-1 rounded-md border border-green-200 bg-green-500/10 font-mono text-[10px] text-green-600">
                  <Star className="size-3" />
                  {submission.grade}%
                </Badge>
              )}
            </div>

            {/* CONTENT */}
            <div className="mt-5 flex-1">
              <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
                {submission.assignmentTitle || "Untitled Assignment"}
              </h3>

              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 shrink-0" />

                  <span className="truncate">
                    {submission.courseCode} • {submission.courseName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="size-4 shrink-0" />

                  <span className="truncate">
                    {submission.lecturer?.name || "Unknown Lecturer"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4 shrink-0" />

                  <span>
                    {formatDistanceToNow(new Date(submission.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {submission.feedback && (
                <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Feedback
                  </p>

                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {submission.feedback}
                  </p>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onViewDetails(submission)}
              >
                <Eye className="mr-2 size-4" />
                View
              </Button>

              <Button
                size="sm"
                className="flex-1 gap-2 font-mono text-sm cursor-pointer hover:bg-primary/90 transition-all duration-200"
                onClick={() => setDownloadDialogOpen(true)}
                disabled={isDownloading}
              >
                <Download className="mr-2 size-4" />

                {isDownloading ? "Downloading..." : "Download"}
              </Button>
            </div>
          </div>
        </Card>
      </>
    );
  }

  // ================= LIST VIEW =================
  return (
    <>
      <DownloadEncryptedDialog
        open={downloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        isDownloading={isDownloading}
        fileName={submission.originalName}
        onConfirm={() => {
          onDownload(submission);
          setDownloadDialogOpen(false);
        }}
      />

      <Card className="group rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg">
        <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT CONTENT */}
          <div className="min-w-0 flex-1">
            {/* BADGES */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  "gap-1 rounded-md border font-mono text-[10px]",
                  config.color,
                )}
              >
                <StatusIcon className="size-3" />
                {config.label}
              </Badge>

              <Badge
                variant="outline"
                className="gap-1 rounded-md font-mono text-[10px]"
              >
                <Shield className="size-3" />
                AES-256
              </Badge>

              {submission.grade !== undefined && (
                <Badge className="gap-1 rounded-md border border-green-200 bg-green-500/10 font-mono text-[10px] text-green-600">
                  <Star className="size-3" />
                  {submission.grade}%
                </Badge>
              )}
            </div>

            {/* TITLE */}
            <h3 className="truncate text-base font-semibold">
              {submission.assignmentTitle || "Untitled Assignment"}
            </h3>

            {/* META */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 shrink-0" />

                <span className="truncate">
                  {submission.courseCode} • {submission.courseName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="size-4 shrink-0" />

                <span className="truncate">
                  {submission.lecturer?.name || "Unknown Lecturer"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />

                <span>
                  {formatDistanceToNow(new Date(submission.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {/* FEEDBACK */}
            {submission.feedback && (
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Feedback
                </p>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {submission.feedback}
                </p>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(submission)}
            >
              <Eye className="mr-2 size-4" />
              View
            </Button>

            <Button
              size="sm"
              onClick={() => setDownloadDialogOpen(true)}
              disabled={isDownloading}
              className="flex-1 gap-2 font-mono text-sm cursor-pointer hover:bg-primary/90 transition-all duration-200"
            >
              <Download className="mr-2 size-4" />

              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
