// components/dashboard/student/recent-submissions.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FileLock2,
  Star,
  Eye,
  ArrowRight,
  CheckCircle,
  Clock,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Submission, SubmissionStatus } from "@/contexts/submission-context";
import { formatDistanceToNow } from "date-fns";

interface RecentSubmissionsProps {
  submissions: Submission[];
}

const statusConfig: Record<
  SubmissionStatus,
  {
    icon: any;
    label: string;
    color: string;
  }
> = {
  submitted: {
    icon: Clock,
    label: "PENDING",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  },

  encrypted: {
    icon: Lock,
    label: "ENCRYPTED",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },

  viewed: {
    icon: Eye,
    label: "VIEWED",
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },

  graded: {
    icon: CheckCircle,
    label: "GRADED",
    color: "bg-green-500/10 text-green-600 border-green-200",
  },

  returned: {
    icon: CheckCircle,
    label: "RETURNED",
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
  },
};

const getStatusConfig = (status: SubmissionStatus) => {
  return statusConfig[status] || statusConfig.submitted;
};

const getStatusProgress = (status: SubmissionStatus) => {
  const steps: SubmissionStatus[] = [
    "submitted",
    "encrypted",
    "viewed",
    "graded",
  ];

  const currentIndex = steps.indexOf(status);

  if (currentIndex === -1) return 0;

  return ((currentIndex + 1) / steps.length) * 100;
};

export function StudentRecentSubmissions({
  submissions,
}: RecentSubmissionsProps) {
  if (submissions.length === 0) {
    return (
      <Card className="rounded-2xl border border-border p-12 text-center shadow-sm">
        <FileLock2 className="mx-auto mb-4 size-12 text-muted-foreground/40" />

        <p className="font-mono text-sm text-muted-foreground">
          NO_SUBMISSIONS_FOUND
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Submit your first assignment
        </p>

        <Button asChild variant="link" className="mt-4 gap-2 font-mono text-xs">
          <Link href="/student/submit">
            SUBMIT_NOW
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const currentStatus = getStatusConfig(submission.status);
        const StatusIcon = currentStatus.icon;
        const progress = getStatusProgress(submission.status);

        return (
          <Card
            key={submission._id}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative p-5">
              {/* hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-primary/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                {/* TOP */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn(
                        "gap-1 rounded-md border font-mono text-[10px]",
                        currentStatus.color,
                      )}
                    >
                      <StatusIcon className="size-3" />
                      {currentStatus.label}
                    </Badge>

                    {submission.grade !== undefined && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-green-200 bg-green-500/10 font-mono text-[10px] text-green-600"
                      >
                        <Star className="size-3" />
                        GRADE: {submission.grade}%
                      </Badge>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formatDistanceToNow(new Date(submission.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="space-y-2">
                  <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
                    {submission.assignmentTitle || "Untitled Assignment"}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="font-medium">{submission.courseCode}</span>

                    <span className="hidden sm:inline">•</span>

                    <span>{submission.courseName}</span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Lecturer:{" "}
                    <span className="font-medium">
                      {submission.lecturer?.name || "Unknown"}
                    </span>
                  </p>
                </div>

                {/* PROGRESS */}
                {(submission.status === "submitted" ||
                  submission.status === "encrypted") && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        PROCESSING
                      </span>

                      <span className="text-[10px] font-mono text-muted-foreground">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* FEEDBACK */}
                {submission.feedback && (
                  <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Lecturer Feedback
                    </p>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
