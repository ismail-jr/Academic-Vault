// components/dashboard/recent-submissions-card.tsx
"use client";

import Link from "next/link";
import {
  FileLock2,
  Eye,
  Zap,
  ArrowRight,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Submission {
  _id: string;
  student: { name: string; email: string };
  courseCode?: string;
  courseName?: string;
  assignmentTitle?: string;
  status: "submitted" | "encrypted" | "viewed" | "graded";
  createdAt: string;
}

interface RecentSubmissionsCardProps {
  submissions: Submission[];
  allSubmissionsCount: number;
  loading: boolean;
  reviewedCount: number;
  totalCount: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
    case "encrypted":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "viewed":
      return "bg-purple-500/10 text-purple-600 border-purple-200";
    case "graded":
      return "bg-green-500/10 text-green-600 border-green-200";
    default:
      return "";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "submitted":
      return <Clock3 className="size-3" />;
    case "encrypted":
      return <FileLock2 className="size-3" />;
    case "viewed":
      return <Eye className="size-3" />;
    case "graded":
      return <CheckCircle2 className="size-3" />;
    default:
      return <FileLock2 className="size-3" />;
  }
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

export function RecentSubmissionsCard({
  submissions,
  allSubmissionsCount,
  loading,
  reviewedCount,
  totalCount,
}: RecentSubmissionsCardProps) {
  return (
    <Card className="rounded-2xl overflow-hidden border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex items-center justify-between border-b border-primary/10 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold font-mono flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            RECENT_SUBMISSIONS
          </h2>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            Latest {submissions.length} student uploads awaiting review
          </p>
        </div>
        <Link href="/lecturer/submissions">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 font-mono text-xs"
          >
            VIEW_ALL ({allSubmissionsCount}) <ArrowRight className="size-3" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-primary/5">
        {loading ? (
          <div className="p-8 text-center">
            <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-mono text-muted-foreground">
              LOADING_SUBMISSIONS...
            </p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center">
            <FileLock2 className="size-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-sm font-mono text-muted-foreground">
              NO_SUBMISSIONS_FOUND
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Waiting for student submissions...
            </p>
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission._id}
              className="group relative flex flex-col gap-4 p-5 hover:bg-primary/5 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileLock2 className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-mono font-semibold text-sm">
                      {submission.assignmentTitle || "Untitled"}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 text-xs",
                        getStatusColor(submission.status),
                      )}
                    >
                      {getStatusIcon(submission.status)}
                      {submission.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {submission.courseCode} - {submission.courseName}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    Student: {submission.student?.name || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="relative flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground">
                  {formatRelativeTime(submission.createdAt)}
                </span>
                <Link href={`/lecturer/submissions/${submission._id}`}>
                  <Button
                    size="sm"
                    className="gap-2 font-mono text-sm cursor-pointer hover:bg-primary/90 transition-all duration-200"
                  >
                    <Eye className="size-3" />
                    REVIEW
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pipeline Progress */}
      {/* {totalCount > 0 && (
        <div className="border-t border-primary/10 p-5 bg-primary/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold">
              REVIEW_PIPELINE
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {Math.round((reviewedCount / totalCount) * 100)}% COMPLETE
            </span>
          </div>
          <div className="relative">
            <Progress
              value={(reviewedCount / totalCount) * 100}
              className="h-1.5 bg-primary/10"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-1">
              {["SUBMITTED", "ENCRYPTED", "VIEWED", "GRADED"].map((step) => (
                <span
                  key={step}
                  className="text-[8px] font-mono text-muted-foreground -translate-x-1/2"
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </Card>
  );
}
