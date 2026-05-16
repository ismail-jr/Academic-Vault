// components/submissions/SubmissionDetailDialog.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Submission, SubmissionStatus } from "@/contexts/submission-context";
import {
  Download,
  Eye,
  CheckCircle,
  Clock,
  Shield,
  KeyRound,
  Lock,
  User,
  Calendar,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SubmissionDetailDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (submission: Submission) => void;
}

const getStatusConfig = (status: SubmissionStatus) => {
  const config = {
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
  };
  return config[status];
};

const getStatusProgress = (status: SubmissionStatus) => {
  const steps = ["submitted", "encrypted", "viewed", "graded"];
  const currentIndex = steps.indexOf(status);
  return ((currentIndex + 1) / steps.length) * 100;
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
};

export function SubmissionDetailDialog({
  submission,
  open,
  onOpenChange,
  onDownload,
}: SubmissionDetailDialogProps) {
  if (!submission) return null;

  const statusConfig = getStatusConfig(submission.status);
  const StatusIcon = statusConfig.icon;
  const isEncrypted = !!(submission.encryptedKey && submission.iv);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-mono font-semibold">
            ~/submissions/{submission._id.slice(-8)}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            SUBMISSION_DETAILS | ENCRYPTED_VIEW
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={cn("gap-2 font-mono px-4 py-2", statusConfig.color)}
            >
              <StatusIcon className="size-4" />
              {statusConfig.label}
            </Badge>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span>PROCESSING_PIPELINE</span>
              <span>{Math.round(getStatusProgress(submission.status))}%</span>
            </div>
            <Progress
              value={getStatusProgress(submission.status)}
              className="h-1.5 bg-primary/10"
            />
            <div className="flex justify-between text-[8px] font-mono text-muted-foreground">
              <span>SUBMITTED</span>
              <span>ENCRYPTED</span>
              <span>VIEWED</span>
              <span>GRADED</span>
            </div>
          </div>

          <Separator className="bg-primary/10" />

          {/* Security Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="gap-1 font-mono text-xs">
              <Shield className="size-3" /> AES-256
            </Badge>
            <Badge variant="outline" className="gap-1 font-mono text-xs">
              <KeyRound className="size-3" /> RSA-2048
            </Badge>
            <Badge
              variant={isEncrypted ? "default" : "secondary"}
              className="gap-1 font-mono text-xs"
            >
              <Lock className="size-3" />{" "}
              {isEncrypted ? "ENCRYPTED" : "PENDING"}
            </Badge>
          </div>

          {/* Assignment Info */}
          <Card className="rounded-xl border-primary/20 bg-background/50 p-5">
            <h3 className="text-sm font-mono font-semibold mb-4">
              ASSIGNMENT_INFORMATION
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">
                  COURSE
                </p>
                <p className="text-sm font-mono">
                  {submission.courseCode} - {submission.courseName}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">
                  LECTURER
                </p>
                <p className="text-sm font-mono">{submission.lecturer.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {submission.lecturer.email}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">
                  FILE
                </p>
                <p className="text-sm font-mono">{submission.originalName}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">
                  SUBMISSION_ID
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  {submission._id}
                </p>
              </div>
            </div>
          </Card>

          {submission.description && (
            <>
              <Separator className="bg-primary/10" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="size-3 text-primary" />
                  <h3 className="text-sm font-mono font-semibold">
                    STUDENT_NOTE
                  </h3>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {submission.description}
                </p>
              </div>
            </>
          )}

          {submission.grade !== undefined && (
            <>
              <Separator className="bg-primary/10" />
              <Card className="rounded-xl border-green-500/20 bg-green-500/5 p-5">
                <h3 className="text-sm font-mono font-semibold mb-4">
                  GRADE_&_FEEDBACK
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    YOUR_GRADE
                  </span>
                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-green-500" />
                    <span className="text-2xl font-bold font-mono text-green-600">
                      {submission.grade}%
                    </span>
                  </div>
                </div>
                {submission.feedback && (
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground mb-2">
                      FEEDBACK:
                    </p>
                    <p className="text-sm font-mono">{submission.feedback}</p>
                  </div>
                )}
              </Card>
            </>
          )}

          <Separator className="bg-primary/10" />

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-mono font-semibold mb-4">TIMELINE</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-mono">SUBMITTED</p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {formatDate(submission.createdAt)}
                  </p>
                </div>
              </div>
              {submission.viewedAt && (
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-mono">VIEWED_BY_LECTURER</p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {formatDate(submission.viewedAt)}
                    </p>
                  </div>
                </div>
              )}
              {submission.gradedAt && (
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-mono">GRADED</p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {formatDate(submission.gradedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-mono"
          >
            CLOSE
          </Button>
          <Button
            onClick={() => onDownload(submission)}
            className="gap-2 font-mono"
          >
            <Download className="size-4" />
            DOWNLOAD_ENCRYPTED
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
