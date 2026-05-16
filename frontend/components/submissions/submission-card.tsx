// components/submissions/submission-card.tsx
"use client";

import { Submission } from "@/contexts/submission-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Eye,
  Download,
  Lock,
  Shield,
  Clock,
  CheckCircle2,
  User,
  BookOpen,
  ArrowRight,
  Calendar,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Props {
  submission: Submission;
  onViewDetails: (s: Submission) => void;
  onDownload: (s: Submission) => void;
  isDownloading?: boolean;
  viewMode?: "grid" | "list";
}

const getStatusConfig = (status: string) => {
  const config = {
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
  };
  return config[status as keyof typeof config] || config.submitted;
};

const getStatusProgress = (status: string) => {
  const steps = ["submitted", "encrypted", "viewed", "graded"];
  const currentIndex = steps.indexOf(status);
  return ((currentIndex + 1) / steps.length) * 100;
};

export function SubmissionCard({
  submission,
  onViewDetails,
  onDownload,
  isDownloading = false,
  viewMode = "grid",
}: Props) {
  const statusConfig = getStatusConfig(submission.status);
  const StatusIcon = statusConfig.icon;

  // Grid View
  if (viewMode === "grid") {
    return (
      <Card className="group rounded-2xl overflow-hidden border-primary/20 hover:shadow-lg transition-all duration-300">
        <div className="relative p-5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                className={cn("gap-1 font-mono text-xs", statusConfig.color)}
              >
                <StatusIcon className="size-3" />
                {statusConfig.label}
              </Badge>
              <Badge variant="outline" className="gap-1 font-mono text-xs">
                <Shield className="size-3" /> AES-256
              </Badge>
              {submission.grade && (
                <Badge
                  variant="outline"
                  className="gap-1 bg-green-500/10 text-green-600 border-green-200 font-mono text-xs"
                >
                  <Star className="size-3" /> {submission.grade}%
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {formatDistanceToNow(new Date(submission.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div>
            <h3 className="font-mono font-semibold text-lg tracking-tight">
              {submission.assignmentTitle || "Untitled Assignment"}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <BookOpen className="size-3" />
              <span className="font-mono text-xs">
                {submission.courseCode} - {submission.courseName}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <User className="size-3 text-muted-foreground" />
              <span className="font-mono text-xs">
                {submission.lecturer?.name || "Unknown"}
              </span>
            </div>
          </div>

          {submission.feedback && (
            <div className="mt-3 rounded-lg bg-primary/5 p-3 border border-primary/10">
              <p className="text-[10px] font-mono text-muted-foreground mb-1">
                FEEDBACK:
              </p>
              <p className="text-xs font-mono line-clamp-2">
                {submission.feedback}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-primary/10">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(submission)}
              className="gap-1 font-mono text-xs"
            >
              <Eye className="size-3" />
              DETAILS
            </Button>
            <Button
              size="sm"
              onClick={() => onDownload(submission)}
              disabled={isDownloading}
              className="gap-1 font-mono text-xs"
            >
              <Download className="size-3" />
              {isDownloading ? "..." : "DOWNLOAD"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // List View
  return (
    <div className="group rounded-xl border border-primary/20 hover:shadow-md transition-all duration-300 bg-background">
      <div className="flex flex-wrap items-center gap-4 p-4">
        <div className="w-28 shrink-0">
          <Badge
            className={cn(
              "gap-1 font-mono text-xs w-full justify-center",
              statusConfig.color,
            )}
          >
            <StatusIcon className="size-3" />
            {statusConfig.label}
          </Badge>
        </div>

        <div className="flex-1 min-w-[180px]">
          <h3 className="font-mono font-semibold text-sm truncate">
            {submission.assignmentTitle || "Untitled"}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="size-3 shrink-0" />
            <span className="font-mono truncate">
              {submission.courseCode} - {submission.courseName}
            </span>
          </div>
        </div>

        <div className="w-36 shrink-0">
          <div className="flex items-center gap-2">
            <User className="size-3 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs truncate">
              {submission.lecturer?.name?.split(" ")[0] || "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Calendar className="size-3 text-muted-foreground shrink-0" />
            <span className="text-[10px] font-mono text-muted-foreground truncate">
              {formatDistanceToNow(new Date(submission.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {submission.grade && (
          <div className="w-16 shrink-0 text-right">
            <Badge
              variant="outline"
              className="gap-1 bg-green-500/10 text-green-600 border-green-200 font-mono text-xs"
            >
              <Star className="size-2.5" />
              {submission.grade}%
            </Badge>
          </div>
        )}

        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(submission)}
            className="gap-1 font-mono text-xs"
          >
            <Eye className="size-3" />
            VIEW
          </Button>
          <Button
            size="sm"
            onClick={() => onDownload(submission)}
            disabled={isDownloading}
            className="gap-1 font-mono text-xs"
          >
            <Download className="size-3" />
            {isDownloading ? "..." : "DL"}
          </Button>
        </div>
      </div>
    </div>
  );
}
