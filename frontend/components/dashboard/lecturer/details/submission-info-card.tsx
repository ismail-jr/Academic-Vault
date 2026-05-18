"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FileLock2,
  Eye,
  Star,
  Shield,
  KeyRound,
  Download,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SubmissionStatus = "submitted" | "encrypted" | "viewed" | "graded";

interface Submission {
  _id: string;
  student: { name: string; email?: string; studentId?: string };
  courseCode?: string;
  courseName?: string;
  status: SubmissionStatus;
  assignmentTitle?: string;
  description?: string;
  createdAt: string;
  originalName?: string;
  grade?: number;
  viewedAt?: string;
  encryptedKey?: string;
  iv?: string;
}

interface SubmissionInfoCardProps {
  submission: Submission;
  onDownload: () => void;
  onGrade: () => void;
  downloadLabel?: string;
  isDecrypted?: boolean;
}

const getStatusConfig = (status: SubmissionStatus) => {
  const map = {
    submitted: {
      label: "PENDING",
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    },
    encrypted: {
      label: "ENCRYPTED",
      icon: FileLock2,
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    viewed: {
      label: "VIEWED",
      icon: Eye,
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
    },
    graded: {
      label: "GRADED",
      icon: CheckCircle,
      color:
        "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-700 hover:text-white",
    },
  };

  return map[status];
};

const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

export function SubmissionInfoCard({
  submission,
  onDownload,
  onGrade,
  downloadLabel,
  isDecrypted = false,
}: SubmissionInfoCardProps) {
  const statusConfig = getStatusConfig(submission.status);
  const StatusIcon = statusConfig.icon;

  const canGrade = isDecrypted && submission.status !== "graded";

  return (
    <Card className="overflow-hidden rounded-2xl border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-6">
        {/* HEADER BADGES */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn("gap-1 font-mono text-xs", statusConfig.color)}
            >
              <StatusIcon className="size-3" />
              {statusConfig.label}
            </Badge>

            <Badge variant="secondary" className="gap-1 font-mono text-xs">
              <Shield className="size-3" />
              AES-256
            </Badge>

            <Badge variant="secondary" className="gap-1 font-mono text-xs">
              <KeyRound className="size-3" />
              RSA-2048
            </Badge>

            {submission.grade !== undefined && (
              <Badge className="gap-1 bg-green-500/10 text-green-600 hover:bg-green-700 hover:text-white border-green-200 font-mono text-xs">
                <Star className="size-3" />
                GRADE: {submission.grade}%
              </Badge>
            )}
          </div>
        </div>

        {/* TITLE */}
        <h2 className="mb-2 text-xl font-bold font-mono">
          {submission.assignmentTitle || "Untitled Assignment"}
        </h2>

        {/* META */}
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>
            {submission.courseCode} - {submission.courseName}
          </span>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 text-xs font-mono">
          <div>
            Student: {submission.student.name}
            {submission.student.studentId && (
              <span className="block text-[10px] text-muted-foreground mt-0.5">
                ID: {submission.student.studentId}
              </span>
            )}
          </div>

          <div>Submitted: {formatRelativeTime(submission.createdAt)}</div>

          <div>File: {submission.originalName}</div>

          {submission.viewedAt && (
            <div>Viewed: {formatRelativeTime(submission.viewedAt)}</div>
          )}
        </div>

        {/* DESCRIPTION */}
        {submission.description && (
          <div className="mb-4 rounded-lg border border-primary/10 bg-muted/30 p-3 text-xs font-mono">
            {submission.description}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={onDownload}
            className="gap-2 font-mono text-sm cursor-pointer hover:bg-primary/90 transition-all duration-200"
          >
            <Download className="size-4" />
            {downloadLabel || "Download"}
          </Button>

          <Button
            onClick={onGrade}
            disabled={!canGrade}
            variant="outline"
            className={cn(
              "gap-2 font-mono text-sm",
              !canGrade && "opacity-50 cursor-not-allowed",
            )}
          >
            <Star className="size-4" />
            ADD_GRADE
          </Button>
        </div>

        {/* LOCK MESSAGE */}
        {!isDecrypted && (
          <p className="mt-2 text-[10px] font-mono text-muted-foreground">
            Decrypt file before grading
          </p>
        )}

        {isDecrypted && submission.status !== "graded" && (
          <p className="mt-2 text-[10px] font-mono text-green-600">
            Ready for grading
          </p>
        )}
      </div>
    </Card>
  );
}
