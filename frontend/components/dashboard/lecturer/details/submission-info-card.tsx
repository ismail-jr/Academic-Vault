// components/dashboard/lecturer/details/submission-info-card.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FileLock2,
  Eye,
  Star,
  User,
  Calendar,
  MessageSquare,
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
      color: "bg-green-500/10 text-green-600 border-green-200",
    },
  };
  return map[status];
};

const formatRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

export function SubmissionInfoCard({
  submission,
  onDownload,
  onGrade,
}: SubmissionInfoCardProps) {
  const statusConfig = getStatusConfig(submission.status);
  const StatusIcon = statusConfig.icon;
  const isEncrypted = !!(submission.encryptedKey && submission.iv);

  return (
    <Card className="rounded-2xl overflow-hidden border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn("gap-1 font-mono text-xs", statusConfig.color)}
            >
              <StatusIcon className="size-3" />
              {statusConfig.label}
            </Badge>
            <Badge
              variant={isEncrypted ? "default" : "secondary"}
              className="gap-1 font-mono text-xs"
            >
              <Shield className="size-3" /> AES-256
            </Badge>
            <Badge
              variant={submission.encryptedKey ? "default" : "secondary"}
              className="gap-1 font-mono text-xs"
            >
              <KeyRound className="size-3" /> RSA-2048
            </Badge>
            {submission.grade && (
              <Badge
                variant="outline"
                className="gap-1 bg-green-500/10 text-green-600 border-green-200 font-mono text-xs"
              >
                <Star className="size-3" /> GRADE: {submission.grade}%
              </Badge>
            )}
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            ID: {submission._id}
          </span>
        </div>

        <h2 className="text-xl font-mono font-bold tracking-tight mb-2">
          {submission.assignmentTitle || "Untitled Assignment"}
        </h2>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <BookOpen className="size-3" />
          <span className="font-mono text-xs">
            {submission.courseCode} - {submission.courseName}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <User className="size-3 text-muted-foreground" />
            <span className="font-mono text-xs">
              Student: {submission.student.name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              ({submission.student.studentId || submission.student.email})
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="font-mono text-xs">
              Submitted: {formatRelativeTime(submission.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileLock2 className="size-3 text-muted-foreground" />
            <span className="font-mono text-xs">
              File: {submission.originalName || "encrypted.bin"}
            </span>
          </div>
          {submission.viewedAt && (
            <div className="flex items-center gap-2 text-sm">
              <Eye className="size-3 text-muted-foreground" />
              <span className="font-mono text-xs">
                Viewed: {formatRelativeTime(submission.viewedAt)}
              </span>
            </div>
          )}
        </div>

        {submission.description && (
          <div className="rounded-lg bg-muted/30 p-3 mb-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="size-3 text-primary" />
              <span className="text-[10px] font-mono font-semibold">
                STUDENT_NOTE
              </span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              {submission.description}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={onDownload} className="gap-2 font-mono text-sm">
            <Download className="size-4" />
            DOWNLOAD_ENCRYPTED
          </Button>
          {submission.status !== "graded" && (
            <Button
              onClick={onGrade}
              variant="outline"
              className="gap-2 font-mono text-sm"
            >
              <Star className="size-4" />
              ADD_GRADE
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
