// contexts/submission-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";

export type SubmissionStage = "idle" | "encrypt" | "rsa" | "upload" | "done";
export type SubmissionStatus = "submitted" | "encrypted" | "viewed" | "graded";

export interface Submission {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    studentId?: string;
  };
  lecturer: {
    _id: string;
    name: string;
    email: string;
  };
  originalName: string;
  filePath: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  courseCode?: string;
  courseName?: string;
  assignmentTitle?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  encryptedKey?: string;
  iv?: string;
  viewedAt?: string;
  gradedAt?: string;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  viewed: number;
  graded: number;
  averageGrade: number;
}

interface SubmissionContextType {
  // Form state
  submission: any;
  stage: SubmissionStage;
  isLoading: boolean;
  isSubmitting: boolean;
  progress: number;

  // Form actions
  setFile: (file: File | null) => void;
  setLecturer: (id: string, name: string) => void;
  setCourseInfo: (code: string, name: string) => void;
  setAssignmentInfo: (title: string, description?: string) => void;
  submitSubmission: () => Promise<boolean>;
  resetSubmission: () => void;

  // Data state
  submissions: Submission[];
  stats: SubmissionStats;

  // Data actions
  fetchSubmissions: () => Promise<void>;
  fetchLecturerSubmissions: () => Promise<void>;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(
  undefined,
);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function SubmissionProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();

  // Form state
  const [submission, setSubmission] = useState({
    file: null as any,
    lecturerId: "",
    lecturerName: "",
    courseCode: "",
    courseName: "",
    assignmentTitle: "",
    description: "",
  });
  const [stage, setStage] = useState<SubmissionStage>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Data state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    pending: 0,
    viewed: 0,
    graded: 0,
    averageGrade: 0,
  });

  const isLoading = stage !== "idle" && stage !== "done";

  const fetchSubmissions = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/submissions/my-submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.submissions) {
        setSubmissions(data.submissions);

        const graded = data.submissions.filter(
          (s: Submission) => s.status === "graded" && s.grade,
        );
        const avgGrade =
          graded.length > 0
            ? graded.reduce(
                (acc: number, s: Submission) => acc + (s.grade || 0),
                0,
              ) / graded.length
            : 0;

        setStats({
          total: data.submissions.length,
          pending: data.submissions.filter(
            (s: Submission) =>
              s.status === "submitted" || s.status === "encrypted",
          ).length,
          viewed: data.submissions.filter(
            (s: Submission) => s.status === "viewed",
          ).length,
          graded: graded.length,
          averageGrade: Math.round(avgGrade),
        });
      }
    } catch (error) {
      console.error("Fetch submissions error:", error);
    }
  };

  const fetchLecturerSubmissions = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/submissions/lecturer/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Fetch lecturer submissions error:", error);
    }
  };

  const simulateStep = async (step: SubmissionStage, duration = 800) => {
    setStage(step);
    await new Promise((resolve) => setTimeout(resolve, duration));
    setProgress((prev) => prev + 33);
  };

  const submitSubmission = async (): Promise<boolean> => {
    if (!submission.file || !token) return false;

    setIsSubmitting(true);
    setProgress(0);

    try {
      await simulateStep("encrypt", 900);
      await simulateStep("rsa", 700);
      setStage("upload");

      const formData = new FormData();
      formData.append("file", submission.file.file);
      formData.append("lecturerId", submission.lecturerId);
      formData.append("courseCode", submission.courseCode);
      formData.append("courseName", submission.courseName);
      formData.append("assignmentTitle", submission.assignmentTitle);
      formData.append("description", submission.description);

      const res = await fetch(`${API_URL}/submissions/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStage("done");
      setProgress(100);
      toast.success("Submission uploaded successfully!");

      await fetchSubmissions();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
      setStage("idle");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmission = () => {
    setSubmission({
      file: null,
      lecturerId: "",
      lecturerName: "",
      courseCode: "",
      courseName: "",
      assignmentTitle: "",
      description: "",
    });
    setStage("idle");
    setProgress(0);
  };

  const setFile = (file: File | null) => {
    setSubmission((prev) => ({
      ...prev,
      file: file
        ? { name: file.name, size: file.size, type: file.type, file }
        : null,
    }));
  };

  const setLecturer = (id: string, name: string) => {
    setSubmission((prev) => ({ ...prev, lecturerId: id, lecturerName: name }));
  };

  const setCourseInfo = (code: string, name: string) => {
    setSubmission((prev) => ({ ...prev, courseCode: code, courseName: name }));
  };

  const setAssignmentInfo = (title: string, description?: string) => {
    setSubmission((prev) => ({
      ...prev,
      assignmentTitle: title,
      description: description || "",
    }));
  };

  // Auto-fetch based on role
  useEffect(() => {
    if (!token || !user) return;
    if (user.role === "student") fetchSubmissions();
    if (user.role === "lecturer") fetchLecturerSubmissions();
  }, [token, user]);

  return (
    <SubmissionContext.Provider
      value={{
        submission,
        stage,
        isLoading,
        isSubmitting,
        progress,
        setFile,
        setLecturer,
        setCourseInfo,
        setAssignmentInfo,
        submitSubmission,
        resetSubmission,
        submissions,
        stats,
        fetchSubmissions,
        fetchLecturerSubmissions,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
}

export function useSubmission() {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error("useSubmission must be used within a SubmissionProvider");
  }
  return context;
}
