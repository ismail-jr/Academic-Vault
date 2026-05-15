// lib/api/auth.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "lecturer";
  phone: string;
  studentId?: string;
}

export interface LoginData {
  identifier: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "student" | "lecturer";
  studentId?: string | null;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class AuthAPI {
  // REGISTER
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: responseData.message || "Registration failed",
        };
      }

      // IMPORTANT:
      // Backend returns:
      // {
      //   success: true,
      //   data: {...user}
      // }

      return {
        success: true,
        data: responseData.data,
      };
    } catch (error) {
      console.error("Register API Error:", error);

      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    }
  }

  // LOGIN
  async login(data: LoginData): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: responseData.message || "Login failed",
        };
      }

      // IMPORTANT:
      // Extract ONLY the user object

      return {
        success: true,
        data: responseData.data,
      };
    } catch (error) {
      console.error("Login API Error:", error);

      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    }
  }

  // LOGOUT
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // GET TOKEN
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("token");
  }

  // GET USER
  getUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");

    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  }

  // CHECK AUTH
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authAPI = new AuthAPI();
