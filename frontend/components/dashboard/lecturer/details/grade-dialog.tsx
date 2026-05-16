// components/dashboard/lecturer/details/grade-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle, Loader2 } from "lucide-react";

interface GradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  grade: number;
  onGradeChange: (grade: number) => void;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function GradeDialog({
  open,
  onOpenChange,
  studentName,
  grade,
  onGradeChange,
  feedback,
  onFeedbackChange,
  onSubmit,
  isSubmitting,
}: GradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-primary/20 bg-background">
        <DialogHeader>
          <DialogTitle className="font-mono flex items-center gap-2">
            <Star className="size-4 text-primary" />
            GRADE_SUBMISSION
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Enter grade and feedback for {studentName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold">
              GRADE (0-100)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => onGradeChange(Number(e.target.value))}
              className="font-mono"
              placeholder="85"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold">FEEDBACK</label>
            <Textarea
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              className="font-mono text-sm min-h-[120px]"
              placeholder="Excellent work! Your analysis was thorough..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-mono"
          >
            CANCEL
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gap-2 font-mono"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle className="size-4" />
            )}
            SUBMIT_GRADE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
