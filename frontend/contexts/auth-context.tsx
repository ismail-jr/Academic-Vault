// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI, User, RegisterData, LoginData } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; message?: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      const storedToken = authAPI.getToken();
      const storedUser = authAPI.getUser();

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data);

      if (!response.success) {
        toast.error(response.message || "Registration failed");
        return { success: false, message: response.message };
      }

      if (response.data) {
        // Store user data and token
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        setToken(response.data.token);

        toast.success("Account created successfully!");

        // Redirect based on role
        setTimeout(() => {
          if (response.data?.role === "student") {
            router.push("/student/dashboard");
          } else {
            router.push("/lecturer/dashboard");
          }
        }, 1000);

        return { success: true };
      }

      return { success: false, message: "No data received" };
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const login = async (data: LoginData) => {
    try {
      const response = await authAPI.login(data);

      if (!response.success) {
        toast.error(response.message || "Login failed");
        return { success: false, message: response.message };
      }

      if (response.data) {
        // Store user data and token
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        setToken(response.data.token);

        toast.success("Welcome back!");

        // Redirect based on role
        setTimeout(() => {
          if (response.data?.role === "student") {
            router.push("/student/dashboard");
          } else {
            router.push("/lecturer/dashboard");
          }
        }, 1000);

        return { success: true };
      }

      return { success: false, message: "No data received" };
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        register,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
