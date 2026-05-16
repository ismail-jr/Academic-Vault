const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface SecurityInfo {
  steps?: string[];
  algorithm?: string;
  status?: string;
  encrypted?: boolean;
}

export interface SubmissionResponse {
  _id: string;
  student: string;
  lecturer: string;
  filePath: string;
  originalName: string;
  encryptedKey: string;
  iv: string;
  status: string;
  createdAt: string;
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
  decryptedFileUrl?: string;
}

class SubmissionsAPI {
  async uploadSubmission(
    file: File,
    lecturerId: string,
    courseCode: string,
    courseName: string,
    assignmentTitle?: string,
    description?: string,
    token?: string,
  ): Promise<UploadResponse> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("lecturerId", lecturerId);
    formData.append("courseCode", courseCode);
    formData.append("courseName", courseName);

    if (assignmentTitle) formData.append("assignmentTitle", assignmentTitle);
    if (description) formData.append("description", description);

    const res = await fetch(`${API_URL}/submissions/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Upload failed");

    return data;
  }

  async getMySubmissions(token: string) {
    const res = await fetch(`${API_URL}/submissions/my-submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch submissions");

    return data.submissions;
  }

  async getSubmissionById(id: string, token: string) {
    const res = await fetch(`${API_URL}/submissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch submission");

    return data.submission;
  }

  async decryptSubmission(id: string, token: string): Promise<DecryptResponse> {
    const res = await fetch(`${API_URL}/submissions/${id}/download-decrypted`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Decryption failed");

    return data;
  }
}

export const submissionsAPI = new SubmissionsAPI();
