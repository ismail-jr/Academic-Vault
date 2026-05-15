// hooks/useRegisterForm.ts
import { useState } from "react";
import { toast } from "sonner";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  studentId: string;
  role: "student" | "lecturer";
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  studentId?: string;
}

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    studentId: "",
    role: "student",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        return undefined;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
        return undefined;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        return undefined;
      case "studentId":
        if (formData.role === "student" && !value.trim()) {
          return "Student ID is required";
        }
        return undefined;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return undefined;
      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (name: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const setRole = (role: "student" | "lecturer") => {
    setFormData((prev) => ({ ...prev, role, studentId: "" }));
    setErrors((prev) => ({ ...prev, studentId: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    newErrors.name = validateField("name", formData.name);
    newErrors.email = validateField("email", formData.email);
    newErrors.phone = validateField("phone", formData.phone);
    newErrors.password = validateField("password", formData.password);
    newErrors.confirmPassword = validateField(
      "confirmPassword",
      formData.confirmPassword,
    );

    if (formData.role === "student") {
      newErrors.studentId = validateField("studentId", formData.studentId);
    }

    // Remove undefined values
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof ValidationErrors] === undefined) {
        delete newErrors[key as keyof ValidationErrors];
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Show first error as toast
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  return {
    formData,
    errors,
    handleChange,
    setRole,
    validateForm,
  };
}
