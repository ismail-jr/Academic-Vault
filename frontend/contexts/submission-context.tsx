// contexts/submission-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import {
  submissionsAPI,
  type LecturerFilters,
  type StatsResponse,
} from "@/lib/api/submissions";

// Types

export type SubmissionStage = "idle" | "encrypt" | "rsa" | "upload" | "done";
export type SubmissionStatus =
  | "submitted"
  | "encrypted"
  | "viewed"
  | "graded"
  | "returned";

export interface Submission {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    studentId?: string;
    phone?: string;
  };
  lecturer: { _id: string; name: string; email: string };
  originalName: string;
  filePath: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  courseCode?: string;
  courseName?: string;
  assignmentTitle?: string;
  description?: string;
  encryptedKey?: string;
  iv?: string;
  viewedAt?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  viewed: number;
  graded: number;
  averageGrade: number;
}

export interface FormState {
  file: { name: string; size: number; type: string; file: File } | null;
  lecturerId: string;
  lecturerName: string;
  courseCode: string;
  courseName: string;
  assignmentTitle: string;
  description: string;
}

interface SubmissionContextType {
  // Form state
  submission: FormState;
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
  lecturerFilters: LecturerFilters;

  // Data fetch actions
  fetchSubmissions: () => Promise<void>;
  fetchLecturerSubmissions: (filters?: LecturerFilters) => Promise<void>;
  fetchSubmissionByStudent: (studentId: string) => Promise<Submission[]>;
  setLecturerFilters: (filters: LecturerFilters) => void;
  refreshLecturerSubmissions: () => Promise<void>;

  // Submission actions
  gradeSubmission: (
    id: string,
    grade: number,
    feedback: string,
  ) => Promise<boolean>;
  deleteSubmission: (id: string) => Promise<boolean>;
  markAsViewed: (id: string) => Promise<boolean>;
  updateStatus: (id: string, status: SubmissionStatus) => Promise<boolean>;

  // Crypto actions
  decryptSubmission: (
    id: string,
  ) => Promise<{ downloadUrl?: string; steps?: string[] } | null>;
  downloadDecrypted: (id: string, originalName: string) => Promise<void>;
  downloadSubmission: (
    id: string,
    originalName: string,
    role: "student" | "lecturer",
  ) => Promise<void>;
}

// Context

const SubmissionContext = createContext<SubmissionContextType | undefined>(
  undefined,
);

//  Provider

export function SubmissionProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();

  //  Form state
  const [submission, setSubmission] = useState<FormState>({
    file: null,
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

  //  Data state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    pending: 0,
    viewed: 0,
    graded: 0,
    averageGrade: 0,
  });
  const [lecturerFilters, setLecturerFilters] = useState<LecturerFilters>({});

  const isLoading = stage !== "idle" && stage !== "done";

  //  Helpers

  const computeStats = (list: Submission[]): SubmissionStats => {
    const graded = list.filter((s) => s.status === "graded" && s.grade != null);
    const avgGrade =
      graded.length > 0
        ? graded.reduce((acc, s) => acc + (s.grade ?? 0), 0) / graded.length
        : 0;
    return {
      total: list.length,
      pending: list.filter(
        (s) => s.status === "submitted" || s.status === "encrypted",
      ).length,
      viewed: list.filter((s) => s.status === "viewed").length,
      graded: graded.length,
      averageGrade: Math.round(avgGrade),
    };
  };

  const simulateStep = async (step: SubmissionStage, duration = 800) => {
    setStage(step);
    await new Promise((r) => setTimeout(r, duration));
    setProgress((prev) => Math.min(prev + 33, 99));
  };
  //  Fetch actions

  const fetchSubmissions = useCallback(async () => {
    if (!token) return;
    try {
      const list = await submissionsAPI.getMySubmissions(token);
      setSubmissions(list as Submission[]);
      setStats(computeStats(list as Submission[]));
    } catch (error: any) {
      console.error("Fetch submissions error:", error);
      toast.error(error.message || "Failed to load submissions");
    }
  }, [token]);

  const fetchLecturerSubmissions = useCallback(
    async (filters?: LecturerFilters) => {
      if (!token) return;
      const activeFilters = filters ?? lecturerFilters;
      try {
        const list = await submissionsAPI.getLecturerSubmissions(
          token,
          activeFilters,
        );
        setSubmissions(list as Submission[]);
        setStats(computeStats(list as Submission[]));
      } catch (error: any) {
        console.error("Fetch lecturer submissions error:", error);
        toast.error(error.message || "Failed to load submissions");
      }
    },
    [token, lecturerFilters],
  );

  // Re-fetch with current filters (useful after mutations)
  const refreshLecturerSubmissions = useCallback(async () => {
    await fetchLecturerSubmissions(lecturerFilters);
  }, [fetchLecturerSubmissions, lecturerFilters]);

  const fetchSubmissionByStudent = useCallback(
    async (studentId: string): Promise<Submission[]> => {
      if (!token) return [];
      try {
        const list = await submissionsAPI.getSubmissionByStudent(
          studentId,
          token,
        );
        return list as Submission[];
      } catch (error: any) {
        console.error("Fetch submission by student error:", error);
        toast.error(error.message || "Failed to load student submissions");
        return [];
      }
    },
    [token],
  );

  // Submission mutation actions

  const submitSubmission = async (): Promise<boolean> => {
    if (!submission.file || !token) return false;

    setIsSubmitting(true);
    setProgress(0);

    try {
      await simulateStep("encrypt", 900);
      await simulateStep("rsa", 700);
      setStage("upload");

      await submissionsAPI.uploadSubmission(
        submission.file.file,
        submission.lecturerId,
        submission.courseCode,
        submission.courseName,
        submission.assignmentTitle,
        submission.description,
        token,
      );

      setStage("done");
      setProgress(100);
      toast.success("Submission uploaded and encrypted successfully!");
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

  const gradeSubmission = async (
    id: string,
    grade: number,
    feedback: string,
  ): Promise<boolean> => {
    if (!token) return false;
    try {
      await submissionsAPI.gradeSubmission(id, grade, feedback, token);
      toast.success("Grade submitted successfully");
      await refreshLecturerSubmissions();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to grade submission");
      return false;
    }
  };

  const deleteSubmission = async (id: string): Promise<boolean> => {
    if (!token) return false;
    try {
      await submissionsAPI.deleteSubmission(id, token);
      toast.success("Submission deleted");
      // Optimistic update — remove from local state immediately
      setSubmissions((prev) => {
        const updated = prev.filter((s) => s._id !== id);
        setStats(computeStats(updated));
        return updated;
      });
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete submission");
      return false;
    }
  };

  const markAsViewed = async (id: string): Promise<boolean> => {
    if (!token) return false;
    try {
      await submissionsAPI.markAsViewed(id, token);
      // Optimistic update — flip status in local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, status: "viewed" as SubmissionStatus } : s,
        ),
      );
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to mark as viewed");
      return false;
    }
  };

  const updateStatus = async (
    id: string,
    status: SubmissionStatus,
  ): Promise<boolean> => {
    if (!token) return false;
    try {
      await submissionsAPI.updateStatus(id, status, token);
      toast.success(`Status updated to "${status}"`);
      setSubmissions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s)),
      );
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
      return false;
    }
  };

  // Crypto actions

  const decryptSubmission = async (
    id: string,
  ): Promise<{ downloadUrl?: string; steps?: string[] } | null> => {
    if (!token) return null;
    try {
      const result = await submissionsAPI.decryptSubmission(id, token);
      toast.success("File decrypted — ready to download");
      return result;
    } catch (error: any) {
      toast.error(error.message || "Decryption failed");
      return null;
    }
  };

  const downloadDecrypted = async (
    id: string,
    originalName: string,
  ): Promise<void> => {
    if (!token) return;
    try {
      await submissionsAPI.downloadDecrypted(id, originalName, token);
    } catch (error: any) {
      toast.error(error.message || "Download failed");
    }
  };

  const downloadSubmission = async (
    id: string,
    originalName: string,
    role: "student" | "lecturer",
  ): Promise<void> => {
    if (!token) return;
    try {
      await submissionsAPI.downloadSubmission(id, originalName, role, token);
    } catch (error: any) {
      toast.error(error.message || "Download failed");
    }
  };

  //  Form actions

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

  const setFile = (file: File | null) =>
    setSubmission((prev) => ({
      ...prev,
      file: file
        ? { name: file.name, size: file.size, type: file.type, file }
        : null,
    }));

  const setLecturer = (id: string, name: string) =>
    setSubmission((prev) => ({ ...prev, lecturerId: id, lecturerName: name }));

  const setCourseInfo = (code: string, name: string) =>
    setSubmission((prev) => ({ ...prev, courseCode: code, courseName: name }));

  const setAssignmentInfo = (title: string, description?: string) =>
    setSubmission((prev) => ({
      ...prev,
      assignmentTitle: title,
      description: description ?? "",
    }));

  // Re-fetch when lecturer filters change
  useEffect(() => {
    if (!token || user?.role !== "lecturer") return;
    fetchLecturerSubmissions(lecturerFilters);
  }, [lecturerFilters]);

  //  Auto-fetch on mount
  useEffect(() => {
    if (!token || !user) return;
    if (user.role === "student") fetchSubmissions();
    if (user.role === "lecturer") fetchLecturerSubmissions();
  }, [token, user]);

  return (
    <SubmissionContext.Provider
      value={{
        // Form state
        submission,
        stage,
        isLoading,
        isSubmitting,
        progress,

        // Form actions
        setFile,
        setLecturer,
        setCourseInfo,
        setAssignmentInfo,
        submitSubmission,
        resetSubmission,

        // Data state
        submissions,
        stats,
        lecturerFilters,

        // Fetch actions
        fetchSubmissions,
        fetchLecturerSubmissions,
        fetchSubmissionByStudent,
        setLecturerFilters,
        refreshLecturerSubmissions,

        // Mutation actions
        gradeSubmission,
        deleteSubmission,
        markAsViewed,
        updateStatus,

        // Crypto actions
        decryptSubmission,
        downloadDecrypted,
        downloadSubmission,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
}

export function useSubmission() {
  const ctx = useContext(SubmissionContext);
  if (!ctx)
    throw new Error("useSubmission must be used within a SubmissionProvider");
  return ctx;
}
