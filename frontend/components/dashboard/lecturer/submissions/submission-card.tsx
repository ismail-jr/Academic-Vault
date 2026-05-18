// components/dashboard/submission-card.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FileLock2,
  Eye,
  Clock,
  CheckCircle,
  Star,
  User,
  BookOpen,
  Calendar,
  MessageSquare,
  Shield,
  KeyRound,
  Lock,
  ArrowRight,
  LayoutGrid,
  Rows,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SubmissionStatus = "submitted" | "encrypted" | "viewed" | "graded";
type ViewMode = "grid" | "list";

interface Submission {
  _id: string;
  student: { name: string; email: string; studentId?: string };
  courseCode?: string;
  courseName?: string;
  assignmentTitle?: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  description?: string;
  createdAt: string;
  encryptedKey?: string;
  iv?: string;
}

interface SubmissionCardProps {
  submission: Submission;
  viewMode?: ViewMode;
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
  const diffMins = Math.floor((now.getTime() - past.getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

export function SubmissionCard({
  submission,
  viewMode = "grid",
}: SubmissionCardProps) {
  const statusConfig = getStatusConfig(submission.status);
  const StatusIcon = statusConfig.icon;
  const isEncrypted = !!(submission.encryptedKey && submission.iv);

  // Grid view (default) - Full card layout
  if (viewMode === "grid") {
    return (
      <Card className="group rounded-2xl overflow-hidden border-primary/20 hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
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
                  <KeyRound className="size-3" /> RSA
                </Badge>
                <Badge
                  variant={submission.iv ? "default" : "secondary"}
                  className="gap-1 font-mono text-xs"
                >
                  <Lock className="size-3" /> IV
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
                {formatRelativeTime(submission.createdAt)}
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
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="size-3 text-muted-foreground" />
                <span className="font-mono text-xs">
                  {submission.student.name}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  ({submission.student.studentId || submission.student.email})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-3 text-muted-foreground" />
                <span className="font-mono text-xs">
                  ID: {submission._id.slice(-8)}
                </span>
              </div>
            </div>

            {submission.description && (
              <div className="flex items-start gap-2 mt-3 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                <MessageSquare className="size-3 mt-0.5" />
                <span className="font-mono">{submission.description}</span>
              </div>
            )}

            {submission.feedback && (
              <div className="rounded-lg bg-primary/5 p-3 mt-3 border border-primary/10">
                <p className="text-[10px] font-mono text-muted-foreground mb-1">
                  LECTURER_FEEDBACK:
                </p>
                <p className="text-xs font-mono">{submission.feedback}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-primary/10">
              <Link href={`/lecturer/submissions/${submission._id}`}>
                <Button
                  size="sm"
                  className="gap-2 font-mono text-sm cursor-pointer hover:bg-primary/90 transition-all duration-200"
                >
                  <Eye className="size-3" />
                  REVIEW_SUBMISSION
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // List view (compact) - Row layout
  return (
    <div className="group rounded-xl border border-primary/20 hover:shadow-md transition-all duration-300 bg-background">
      <div className="flex flex-wrap items-center gap-4 p-4">
        {/* Status Badge */}
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

        {/* Assignment Info */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-mono font-semibold text-sm truncate">
            {submission.assignmentTitle || "Untitled Assignment"}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="size-3 shrink-0" />
            <span className="font-mono truncate">
              {submission.courseCode} - {submission.courseName}
            </span>
          </div>
        </div>

        {/* Student Info */}
        <div className="w-48 shrink-0">
          <div className="flex items-center gap-2">
            <User className="size-3 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs truncate">
              {submission.student.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Calendar className="size-3 text-muted-foreground shrink-0" />
            <span className="text-[10px] font-mono text-muted-foreground truncate">
              {formatRelativeTime(submission.createdAt)}
            </span>
          </div>
        </div>

        {/* Encryption Badges */}
        <div className="flex gap-1 shrink-0">
          <Badge
            variant={isEncrypted ? "default" : "secondary"}
            className="gap-1 font-mono text-[10px]"
          >
            <Shield className="size-2.5" /> AES
          </Badge>
          <Badge
            variant={submission.encryptedKey ? "default" : "secondary"}
            className="gap-1 font-mono text-[10px]"
          >
            <KeyRound className="size-2.5" /> RSA
          </Badge>
        </div>

        {/* Grade if available */}
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

        {/* Action Button */}
        <Link
          href={`/lecturer/submissions/${submission._id}`}
          className="shrink-0"
        >
          <Button
            size="sm"
            variant="outline"
            className="gap-1 font-mono text-xs cursor-pointer hover:bg-primary/90 hover:text-white transition-all duration-200"
          >
            <Eye className="size-3" />
            REVIEW
          </Button>
        </Link>
      </div>
    </div>
  );
}
