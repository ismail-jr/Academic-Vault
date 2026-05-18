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
type Stage = "idle" | "rsa" | "aes" | "done";

interface Submission {
  _id: string;
  student: { name: string; email?: string; studentId?: string };
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
  isDecrypted?: boolean;
}

export default function ReviewSubmissionPage() {
  const { token } = useAuth();
  const { id } = useParams();

  const submissionId = id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  const [stage, setStage] = useState<Stage>("idle");
  const [decrypting, setDecrypting] = useState(false);

  const [decryptedContent, setDecryptedContent] = useState("");
  const [decryptionSteps, setDecryptionSteps] = useState<string[]>([]);

  const [grade, setGrade] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [openGrade, setOpenGrade] = useState(false);
  const [submittingGrade, setSubmittingGrade] = useState(false);

  // Derived state - use submission.isDecrypted directly
  const isDecrypted = submission?.isDecrypted || false;

  // ---------------- FETCH ----------------
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

      const sub = data.submission;
      setSubmission(sub);
      setGrade(sub.grade || 0);
      setFeedback(sub.feedback || "");

      // If already decrypted, update UI to show done state
      if (sub.isDecrypted) {
        setStage("done");
        setDecryptionSteps(["Already decrypted", "Ready for download"]);
        setDecryptedContent(`
DECRYPTION SUCCESSFUL

Assignment: ${sub.assignmentTitle || "Untitled"}
Student: ${sub.student.name}
Course: ${sub.courseCode || "N/A"}

✓ File already decrypted
✓ Ready for review and grading
        `);
      }

      // Mark as viewed if not already
      if (!sub.viewedAt) {
        await markViewed();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load submission");
    } finally {
      setLoading(false);
    }
  };

  const markViewed = async () => {
    try {
      await fetch(`${API_URL}/submissions/${submissionId}/view`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local state
      setSubmission((prev) =>
        prev ? { ...prev, viewedAt: new Date().toISOString() } : prev,
      );
    } catch (error) {
      console.error("Failed to mark as viewed:", error);
    }
  };

  // DECRYPT
  const decrypt = async () => {
    if (!token || !submission) return;

    if (isDecrypted) {
      toast.info("File already decrypted");
      return;
    }

    try {
      setDecrypting(true);

      // Simulate RSA decryption step
      setStage("rsa");
      await new Promise((r) => setTimeout(r, 800));

      // Simulate AES decryption step
      setStage("aes");
      await new Promise((r) => setTimeout(r, 1000));

      // Call the actual decrypt API
      const res = await fetch(
        `${API_URL}/submissions/${submissionId}/decrypt`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setDecryptionSteps(
        data.steps || [
          "Encrypted AES key retrieved",
          "RSA decryption completed",
          "AES file decrypted",
          "Ready for download",
        ],
      );

      setDecryptedContent(`
DECRYPTION SUCCESSFUL

Assignment: ${submission.assignmentTitle || "Untitled"}
Student: ${submission.student.name}
Student ID: ${submission.student.studentId || "N/A"}
Course: ${submission.courseCode || "N/A"} - ${submission.courseName || ""}

✓ RSA-2048 key decrypted
✓ AES-256 file decrypted
✓ Integrity verified
✓ Ready for grading

You can now download the decrypted file and add a grade.
      `);

      setStage("done");
      toast.success("Decryption complete! You can now grade this submission.");

      // CRITICAL: Re-fetch submission to get updated isDecrypted flag
      await fetchSubmission();
    } catch (err: any) {
      console.error("Decryption error:", err);
      toast.error(err.message || "Decryption failed");
      setStage("idle");
      setDecryptionSteps([]);
    } finally {
      setDecrypting(false);
    }
  };

  // DOWNLOAD
  const download = async () => {
    if (!token || !submission) return;

    try {
      let endpoint;
      let filename;

      if (isDecrypted) {
        // Download decrypted file
        endpoint = `${API_URL}/submissions/${submissionId}/download-decrypted`;
        filename = submission.originalName || "decrypted_file";
      } else {
        // Download encrypted file
        endpoint = `${API_URL}/submissions/${submissionId}/download`;
        filename = `${submission.originalName || "encrypted_file"}.enc`;
      }

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Download failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        isDecrypted ? "Decrypted file downloaded" : "Encrypted file downloaded",
      );
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error(err.message || "Download failed");
    }
  };

  //  GRADE
  const submitGrade = async () => {
    if (!token || !submission) return;

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

      // Update local state
      setSubmission((prev) =>
        prev
          ? {
              ...prev,
              status: "graded",
              grade: grade,
              feedback: feedback,
              gradedAt: new Date().toISOString(),
            }
          : prev,
      );

      setOpenGrade(false);
      toast.success(`Grade ${grade}% submitted successfully!`);

      // Refresh to get updated stats
      await fetchSubmission();
    } catch (err: any) {
      console.error("Grade submission error:", err);
      toast.error(err.message || "Failed to save grade");
    } finally {
      setSubmittingGrade(false);
    }
  };

  //  UI
  if (loading) return <LoadingState />;
  if (!submission) return <NotFoundState />;

  return (
    <div className="space-y-8">
      <DetailsTerminalHeader submissionId={submission._id} />

      <SubmissionInfoCard
        submission={submission}
        onDownload={download}
        onGrade={() => setOpenGrade(true)}
        downloadLabel={
          isDecrypted ? "DOWNLOAD_DECRYPTED" : "DOWNLOAD_ENCRYPTED"
        }
        isDecrypted={isDecrypted}
      />

      <DecryptionPipeline
        stage={stage}
        decrypting={decrypting}
        decryptedContent={decryptedContent}
        decryptionSteps={decryptionSteps}
        isDecrypted={isDecrypted}
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
