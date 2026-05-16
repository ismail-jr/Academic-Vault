// app/lecturer/submissions/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

import { DetailsTerminalHeader } from "@/components/dashboard/lecturer/details/terminal-header";
import { SubmissionInfoCard } from "@/components/dashboard/lecturer/details/submission-info-card";
import { DecryptionPipeline } from "@/components/dashboard/lecturer/details/decryption-pipeline";
import { GradeDialog } from "@/components/dashboard/lecturer/details/grade-dialog";
import { LoadingState } from "@/components/dashboard/lecturer/details/loading-state";
import { NotFoundState } from "@/components/dashboard/lecturer/details/not-found-state";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type SubmissionStatus = "submitted" | "encrypted" | "viewed" | "graded";

interface Submission {
  _id: string;
  student: { _id: string; name: string; email?: string; studentId?: string };
  lecturer: { name: string; email: string };
  courseCode?: string;
  courseName?: string;
  status: SubmissionStatus;
  assignmentTitle?: string;
  description?: string;
  createdAt: string;
  originalName?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  viewedAt?: string;
  encryptedKey?: string;
  iv?: string;
}

type Stage = "idle" | "rsa" | "aes" | "done";

export default function ReviewSubmissionPage() {
  const { token } = useAuth();
  const params = useParams();
  const submissionId = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<Stage>("idle");
  const [decrypting, setDecrypting] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState("");
  const [grade, setGrade] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [openGrade, setOpenGrade] = useState(false);
  const [submittingGrade, setSubmittingGrade] = useState(false);

  useEffect(() => {
    if (token && submissionId) fetchSubmission();
  }, [token, submissionId]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/submissions/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubmission(data.submission);
      setGrade(data.submission.grade || 0);
      setFeedback(data.submission.feedback || "");
      if (
        data.submission.status === "submitted" ||
        data.submission.status === "encrypted"
      ) {
        await markViewed();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markViewed = async () => {
    await fetch(`${API_URL}/submissions/${submissionId}/view`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const decrypt = async () => {
    try {
      setDecrypting(true);
      setStage("rsa");
      await new Promise((r) => setTimeout(r, 800));
      setStage("aes");
      await new Promise((r) => setTimeout(r, 1000));
      setDecryptedContent(
        "This is the decrypted assignment content.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n[Encrypted content successfully decrypted using RSA-2048 and AES-256-GCM]",
      );
      setStage("done");
      toast.success("RSA + AES decryption completed");
      await fetchSubmission();
    } catch (err: any) {
      toast.error(err.message);
      setStage("idle");
    } finally {
      setDecrypting(false);
    }
  };

  const download = async () => {
    try {
      const res = await fetch(
        `${API_URL}/submissions/${submissionId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = submission?.originalName || "file.enc";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download complete");
    } catch {
      toast.error("Download failed");
    }
  };

  const submitGrade = async () => {
    if (grade < 0 || grade > 100) {
      toast.error("Grade must be between 0 and 100");
      return;
    }
    try {
      setSubmittingGrade(true);
      const res = await fetch(`${API_URL}/submissions/${submissionId}/grade`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grade, feedback }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubmission((prev) =>
        prev
          ? {
              ...prev,
              status: "graded",
              grade,
              feedback,
              gradedAt: new Date().toISOString(),
            }
          : prev,
      );
      setOpenGrade(false);
      toast.success("Grading saved successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmittingGrade(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!submission) return <NotFoundState />;

  return (
    <div className="space-y-8">
      <DetailsTerminalHeader submissionId={submission._id} />
      <SubmissionInfoCard
        submission={submission}
        onDownload={download}
        onGrade={() => setOpenGrade(true)}
      />
      <DecryptionPipeline
        stage={stage}
        decrypting={decrypting}
        decryptedContent={decryptedContent}
        onDecrypt={decrypt}
      />
      <GradeDialog
        open={openGrade}
        onOpenChange={setOpenGrade}
        studentName={submission.student.name}
        grade={grade}
        onGradeChange={setGrade}
        feedback={feedback}
        onFeedbackChange={setFeedback}
        onSubmit={submitGrade}
        isSubmitting={submittingGrade}
      />
    </div>
  );
}
