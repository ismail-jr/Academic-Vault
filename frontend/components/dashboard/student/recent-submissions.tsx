// components/dashboard/student/recent-submissions.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FileLock2, Star, Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Submission } from "@/contexts/submission-context";
import { formatDistanceToNow } from "date-fns";

interface RecentSubmissionsProps {
  submissions: Submission[];
}

const getStatusConfig = (status: Submission["status"]) => {
  const config = {
    submitted: {
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      label: "PENDING",
    },
    encrypted: {
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
      label: "PROCESSING",
    },
    viewed: {
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
      label: "VIEWED",
    },
    graded: {
      color: "bg-green-500/10 text-green-600 border-green-200",
      label: "GRADED",
    },
  };
  return config[status];
};

const getStatusProgress = (status: Submission["status"]) => {
  const steps = ["submitted", "encrypted", "viewed", "graded"];
  const currentIndex = steps.indexOf(status);
  return ((currentIndex + 1) / steps.length) * 100;
};

export function StudentRecentSubmissions({
  submissions,
}: RecentSubmissionsProps) {
  if (submissions.length === 0) {
    return (
      <Card className="rounded-2xl p-12 text-center border-primary/20">
        <FileLock2 className="mx-auto size-12 text-muted-foreground mb-4 opacity-30" />
        <p className="text-sm font-mono text-muted-foreground">
          NO_SUBMISSIONS_FOUND
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Submit your first assignment
        </p>
        <Link href="/student/submit">
          <Button variant="link" className="mt-4 gap-2 font-mono text-xs">
            SUBMIT_NOW <ArrowRight className="size-3" />
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const statusConfig = getStatusConfig(submission.status);
        const progress = getStatusProgress(submission.status);

        return (
          <Card
            key={submission._id}
            className="group rounded-2xl overflow-hidden border-primary/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative p-5">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={cn(
                      "gap-1 font-mono text-xs",
                      statusConfig.color,
                    )}
                  >
                    {statusConfig.label}
                  </Badge>
                  {submission.grade && (
                    <Badge
                      variant="outline"
                      className="gap-1 bg-green-500/10 text-green-600 border-green-200 font-mono text-xs"
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

              <div>
                <h3 className="font-mono font-semibold text-lg tracking-tight">
                  {submission.assignmentTitle || "Untitled Assignment"}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span className="font-mono text-xs">
                    {submission.courseCode} - {submission.courseName}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  Lecturer: {submission.lecturer?.name || "Unknown"}
                </p>
              </div>

              {/* Progress indicator */}
              {(submission.status === "submitted" ||
                submission.status === "encrypted") && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span>{statusConfig.label}</span>
                  </div>
                </div>
              )}

              {/* Feedback preview */}
              {submission.feedback && (
                <div className="mt-3 rounded-lg bg-primary/5 p-3 border border-primary/10">
                  <p className="text-[10px] font-mono text-muted-foreground mb-1">
                    LECTURER_FEEDBACK:
                  </p>
                  <p className="text-xs font-mono line-clamp-2">
                    {submission.feedback}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-primary/10">
                <Link href={`/student/submissions/${submission._id}`}>
                  <Button
                    size="sm"
                    className="gap-2 font-mono text-xs group-hover:shadow-lg transition-all"
                  >
                    <Eye className="size-3" />
                    VIEW_DETAILS
                    <ArrowRight className="size-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
