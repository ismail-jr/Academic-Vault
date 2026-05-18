// lib/api/submissions.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//Types

export interface SecurityInfo {
  steps?: string[];
  algorithm?: string;
  status?: string;
  encrypted?: boolean;
  access?: string;
}

export interface Lecturer {
  _id: string;
  name: string;
  email: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  phone?: string;
}

export interface Grade {
  value: number;
  feedback?: string;
  gradedAt?: string;
}

export interface SubmissionResponse {
  _id: string;
  student: Student | string;
  lecturer: Lecturer | string;
  filePath: string;
  originalName: string;
  encryptedKey: string;
  iv: string;
  status: "encrypted" | "submitted" | "viewed" | "graded" | "returned";
  courseCode?: string;
  courseName?: string;
  assignmentTitle?: string;
  description?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  viewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  submission: SubmissionResponse;
  security?: SecurityInfo;
}

export interface DecryptResponse {
  success: boolean;
  message: string;
  steps?: string[];
  downloadUrl?: string;
}

export interface GradeResponse {
  success: boolean;
  message: string;
  submission: Pick<
    SubmissionResponse,
    "_id" | "grade" | "feedback" | "status" | "gradedAt"
  >;
}

export interface StatusResponse {
  success: boolean;
  message: string;
  submission: Pick<SubmissionResponse, "_id" | "status" | "updatedAt">;
}

export interface StatsResponse {
  success: boolean;
  stats: Array<{ _id: string; count: number; averageGrade?: number }>;
  courseStats: Array<{
    _id: string;
    count: number;
    gradedCount: number;
    averageGrade?: number;
  }>;
  recentActivity: Array<{
    _id: string;
    status: string;
    assignmentTitle?: string;
    updatedAt: string;
    student?: Pick<Student, "name">;
  }>;
  summary: {
    total: number;
    pending: number;
    viewed: number;
    graded: number;
  };
}

export interface LecturerFilters {
  status?: string;
  courseCode?: string;
  search?: string;
}

// ─── API Class

class SubmissionsAPI {
  private auth(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
  }

  private json(token: string): Record<string, string> {
    return { ...this.auth(token), "Content-Type": "application/json" };
  }

  // ── STUDENT ROUTES

  /**
   * POST /submissions/upload
   * Upload + encrypt a new submission (student only).
   */
  async uploadSubmission(
    file: File,
    lecturerId: string,
    courseCode: string,
    courseName: string,
    assignmentTitle: string,
    description: string,
    token: string,
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lecturerId", lecturerId);
    formData.append("courseCode", courseCode);
    formData.append("courseName", courseName);
    formData.append("assignmentTitle", assignmentTitle);
    formData.append("description", description);

    const res = await fetch(`${API_URL}/submissions/upload`, {
      method: "POST",
      headers: this.auth(token),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data;
  }

  /**
   * GET /submissions/my-submissions
   * Get all submissions for the logged-in student.
   */
  async getMySubmissions(token: string): Promise<SubmissionResponse[]> {
    const res = await fetch(`${API_URL}/submissions/my-submissions`, {
      headers: this.auth(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch submissions");
    return data.submissions;
  }

  /**
   * GET /submissions/student/:studentId/all
   * Get all submissions for a specific student.
   * Students can only fetch their own; lecturers can fetch any.
   */
  async getSubmissionByStudent(
    studentId: string,
    token: string,
  ): Promise<SubmissionResponse[]> {
    const res = await fetch(`${API_URL}/submissions/student/${studentId}/all`, {
      headers: this.auth(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch submissions");
    return data.submissions;
  }

  // ── LECTURER ROUTES

  /**
   * GET /submissions/lecturer/submissions
   * Get all submissions assigned to the logged-in lecturer.
   * Supports optional filters: status, courseCode, search.
   */
  async getLecturerSubmissions(
    token: string,
    filters?: LecturerFilters,
  ): Promise<SubmissionResponse[]> {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters ?? {}).filter(([, v]) => Boolean(v)),
      ) as Record<string, string>,
    );
    const res = await fetch(
      `${API_URL}/submissions/lecturer/submissions?${params}`,
      { headers: this.auth(token) },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch submissions");
    return data.submissions;
  }

  /**
   * GET /submissions/lecturer/stats
   * Get submission statistics for the logged-in lecturer.
   */
  async getLecturerStats(token: string): Promise<StatsResponse> {
    const res = await fetch(`${API_URL}/submissions/lecturer/stats`, {
      headers: this.auth(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
    return data;
  }

  /**
   * POST /submissions/:id/grade
   * Grade a submission (adds grade + feedback, sets status to "graded").
   */
  async gradeSubmission(
    id: string,
    grade: number,
    feedback: string,
    token: string,
  ): Promise<GradeResponse> {
    const res = await fetch(`${API_URL}/submissions/${id}/grade`, {
      method: "POST",
      headers: this.json(token),
      body: JSON.stringify({ grade, feedback }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to grade submission");
    return data;
  }

  /**
   * POST /submissions/:id/view
   * Mark a submission as viewed (sets status to "viewed").
   */
  async markAsViewed(
    id: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_URL}/submissions/${id}/view`, {
      method: "POST",
      headers: this.auth(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to mark as viewed");
    return data;
  }

  /**
   * PATCH /submissions/:id/status
   * Manually update a submission's status (lecturer only).
   * Allowed: "encrypted" | "submitted" | "viewed" | "graded" | "returned"
   */
  async updateStatus(
    id: string,
    status: SubmissionResponse["status"],
    token: string,
  ): Promise<StatusResponse> {
    const res = await fetch(`${API_URL}/submissions/${id}/status`, {
      method: "PATCH",
      headers: this.json(token),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update status");
    return data;
  }

  // ── CRYPTOGRAPHY ROUTES

  /**
   * POST /submissions/:id/decrypt
   * Decrypt the submission file server-side (lecturer only).
   * Must be called before downloadDecrypted.
   */
  async decryptSubmission(id: string, token: string): Promise<DecryptResponse> {
    const res = await fetch(`${API_URL}/submissions/${id}/decrypt`, {
      method: "POST",
      headers: this.auth(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Decryption failed");
    return data;
  }

  /**
   * GET /submissions/:id/download-decrypted
   * Download the decrypted file (lecturer only).
   * Requires POST /:id/decrypt to be called first.
   * Triggers a browser save dialog.
   */
  async downloadDecrypted(
    id: string,
    originalName: string,
    token: string,
  ): Promise<void> {
    const res = await fetch(`${API_URL}/submissions/${id}/download-decrypted`, {
      headers: this.auth(token),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).message || "Download failed");
    }
    await this._triggerDownload(res, originalName);
  }

  // ── SHARED ROUTES

  /**
   * GET /submissions/:id/download
   * Student  → downloads the encrypted .enc file.
   * Lecturer → downloads the decrypted file (only after /:id/decrypt).
   */
  async downloadSubmission(
    id: string,
    originalName: string,
    role: "student" | "lecturer",
    token: string,
  ): Promise<void> {
    const res = await fetch(`${API_URL}/submissions/${id}/download`, {
      headers: this.auth(token),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).message || "Download failed");
    }
    const filename = role === "student" ? `${originalName}.enc` : originalName;
    await this._triggerDownload(res, filename);
  }

  /**
   * GET /submissions/:id
   * Get a single submission by ID.
   * Student sees own; lecturer sees submissions assigned to them.
   */
  async getSubmissionById(
    id: string,
    token: string,
  ): Promise<{ submission: SubmissionResponse; security?: SecurityInfo }> {
    const res = await fetch(`${API_URL}/submissions/${id}`, {
      headers: this.auth(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch submission");
    return data;
  }

  /**
   * DELETE /submissions/:id
   * Student can delete own; lecturer can delete submissions assigned to them.
   */
  async deleteSubmission(
    id: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_URL}/submissions/${id}`, {
      method: "DELETE",
      headers: this.auth(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete submission");
    return data;
  }

  // ── Private helpers

  private async _triggerDownload(
    res: Response,
    filename: string,
  ): Promise<void> {
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}

export const submissionsAPI = new SubmissionsAPI();
