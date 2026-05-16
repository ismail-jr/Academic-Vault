// lib/api/users.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Lecturer {
  _id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  count?: number;
  lecturers?: T[];
  lecturer?: T;
  message?: string;
}

class UsersAPI {
  async getLecturers(token: string): Promise<ApiResponse<Lecturer>> {
    try {
      const response = await fetch(`${API_URL}/user/lecturers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lecturers");
      }

      return data;
    } catch (error) {
      console.error("Get lecturers error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch lecturers",
      };
    }
  }

  async getLecturerById(
    id: string,
    token: string,
  ): Promise<ApiResponse<Lecturer>> {
    try {
      const response = await fetch(`${API_URL}/user/lecturers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lecturer");
      }

      return data;
    } catch (error) {
      console.error("Get lecturer by ID error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch lecturer",
      };
    }
  }
}

export const usersAPI = new UsersAPI();
