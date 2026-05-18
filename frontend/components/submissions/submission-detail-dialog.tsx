// components/submissions/SubmissionDetailDialog.tsx
"use client";

import { useState } from "react";

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
  MessageSquare,
  Star,
} from "lucide-react";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { DownloadEncryptedDialog } from "../download-encrypted-dialog";

interface SubmissionDetailDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (submission: Submission) => void;
  isDownloading?: boolean;
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

  if (currentIndex === -1) return 25;

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
  isDownloading = false,
}: SubmissionDetailDialogProps) {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  if (!submission) return null;

  const config = getStatusConfig(submission.status);

  const StatusIcon = config.icon;

  const isEncrypted = !!(submission.encryptedKey && submission.iv);

  return (
    <>
      {/* DOWNLOAD CONFIRM DIALOG */}
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

      {/* MAIN DETAILS DIALOG */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-mono text-xl font-semibold">
              ~/submissions/{submission._id.slice(-8)}
            </DialogTitle>

            <DialogDescription className="font-mono text-xs">
              SUBMISSION_DETAILS | ENCRYPTED_VIEW
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* STATUS */}
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className={cn("gap-2 px-4 py-2 font-mono", config.color)}
              >
                <StatusIcon className="size-4" />
                {config.label}
              </Badge>
            </div>

            {/* PROGRESS */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[10px]">
                <span>PROCESSING_PIPELINE</span>

                <span>{Math.round(getStatusProgress(submission.status))}%</span>
              </div>

              <Progress
                value={getStatusProgress(submission.status)}
                className="h-1.5 bg-primary/10"
              />

              <div className="flex justify-between font-mono text-[8px] text-muted-foreground">
                <span>SUBMITTED</span>
                <span>ENCRYPTED</span>
                <span>VIEWED</span>
                <span>GRADED</span>
              </div>
            </div>

            <Separator className="bg-primary/10" />

            {/* SECURITY */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="gap-1 font-mono text-xs">
                <Shield className="size-3" />
                AES-256
              </Badge>

              <Badge variant="outline" className="gap-1 font-mono text-xs">
                <KeyRound className="size-3" />
                RSA-2048
              </Badge>

              <Badge
                variant={isEncrypted ? "default" : "secondary"}
                className="gap-1 font-mono text-xs"
              >
                <Lock className="size-3" />

                {isEncrypted ? "ENCRYPTED" : "PENDING"}
              </Badge>
            </div>

            {/* ASSIGNMENT INFO */}
            <Card className="rounded-xl border-primary/20 bg-background/50 p-5">
              <h3 className="mb-4 font-mono text-sm font-semibold">
                ASSIGNMENT_INFORMATION
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    COURSE
                  </p>

                  <p className="font-mono text-sm">
                    {submission.courseCode} - {submission.courseName}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    LECTURER
                  </p>

                  <p className="font-mono text-sm">
                    {submission.lecturer.name}
                  </p>

                  <p className="font-mono text-[10px] text-muted-foreground">
                    {submission.lecturer.email}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    FILE
                  </p>

                  <p className="font-mono text-sm">{submission.originalName}</p>
                </div>
              </div>
            </Card>

            {/* DESCRIPTION */}
            {submission.description && (
              <>
                <Separator className="bg-primary/10" />

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <MessageSquare className="size-3 text-primary" />

                    <h3 className="font-mono text-sm font-semibold">
                      STUDENT_NOTE
                    </h3>
                  </div>

                  <p className="font-mono text-sm text-muted-foreground">
                    {submission.description}
                  </p>
                </div>
              </>
            )}

            {/* GRADE */}
            {submission.grade !== undefined && (
              <>
                <Separator className="bg-primary/10" />

                <Card className="rounded-xl border-green-500/20 bg-green-500/5 p-5">
                  <h3 className="mb-4 font-mono text-sm font-semibold">
                    GRADE_&_FEEDBACK
                  </h3>

                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      YOUR_GRADE
                    </span>

                    <div className="flex items-center gap-2">
                      <Star className="size-4 text-green-500" />

                      <span className="font-mono text-2xl font-bold text-green-600">
                        {submission.grade}%
                      </span>
                    </div>
                  </div>

                  {submission.feedback && (
                    <div>
                      <p className="mb-2 font-mono text-[10px] text-muted-foreground">
                        FEEDBACK:
                      </p>

                      <p className="font-mono text-sm">{submission.feedback}</p>
                    </div>
                  )}
                </Card>
              </>
            )}

            <Separator className="bg-primary/10" />

            {/* TIMELINE */}
            <div>
              <h3 className="mb-4 font-mono text-sm font-semibold">TIMELINE</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-blue-500" />

                  <div className="flex-1">
                    <p className="font-mono text-sm">SUBMITTED</p>

                    <p className="font-mono text-[10px] text-muted-foreground">
                      {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>

                {submission.viewedAt && (
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-purple-500" />

                    <div className="flex-1">
                      <p className="font-mono text-sm">VIEWED_BY_LECTURER</p>

                      <p className="font-mono text-[10px] text-muted-foreground">
                        {formatDate(submission.viewedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {submission.gradedAt && (
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-green-500" />

                    <div className="flex-1">
                      <p className="font-mono text-sm">GRADED</p>

                      <p className="font-mono text-[10px] text-muted-foreground">
                        {formatDate(submission.gradedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* FOOTER */}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-mono"
            >
              CLOSE
            </Button>

            <Button
              onClick={() => setDownloadDialogOpen(true)}
              className="gap-2 font-mono"
            >
              <Download className="size-4" />
              DOWNLOAD_ENCRYPTED
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
