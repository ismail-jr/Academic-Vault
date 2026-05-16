// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";

import {
  Shield,
  Lock,
  KeyRound,
  ShieldCheck,
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  User,
  GraduationCap,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useRegisterForm } from "@/hooks/useRegisterForm";

type Role = "student" | "lecturer";

export default function RegisterPage() {
  const { register, isLoading: authLoading } = useAuth();
  const { formData, errors, handleChange, setRole, validateForm } =
    useRegisterForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      studentId: formData.role === "student" ? formData.studentId : undefined,
    });

    setLoading(false);
  };

  const isLoading = loading || authLoading;

  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      {/* LEFT PANEL - Same as before */}
      <div className="relative hidden overflow-hidden border-r border-border lg:flex">
        <div className="absolute inset-0 encrypted-overlay opacity-50" />
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <div className="glow-trust flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Vault</h2>
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Zero-Trust Academic System
              </p>
            </div>
          </div>

          <div className="max-w-xl space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <ShieldCheck className="size-3.5" />
                End-to-End Encryption
              </div>
              <h1 className="font-heading text-5xl leading-tight font-semibold">
                Create a secure academic identity
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                Vault protects student submissions with client-side AES-256
                encryption and RSA-wrapped access control. Your data remains
                private and tamper-resistant.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="shadow-card flex items-start gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Lock className="size-4" />
                </div>
                <div>
                  <h3 className="font-medium">AES-256 Encryption</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Files are encrypted before reaching the server.
                  </p>
                </div>
              </div>

              <div className="shadow-card flex items-start gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <KeyRound className="size-4" />
                </div>
                <div>
                  <h3 className="font-medium">RSA Key Wrapping</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Each submission is protected with recipient-specific access.
                  </p>
                </div>
              </div>

              <div className="shadow-card flex items-start gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield className="size-4" />
                </div>
                <div>
                  <h3 className="font-medium">Audit Integrity</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Every action is logged with tamper-evident verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 Vault — Zero-Trust by design.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative flex items-center justify-center overflow-hidden p-6 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.68_0.16_258/.10),transparent_35%)]" />

        <form
          onSubmit={handleSubmit}
          className="shadow-card relative z-10 w-full max-w-2xl rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-xl"
        >
          <div className="mb-8 text-center">
            <div className="glow-trust mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Shield className="size-6" />
            </div>
            <h1 className="font-heading text-3xl font-semibold">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Secure registration for students and lecturers
            </p>
          </div>

          {/* ROLE SELECTION */}
          <div className="mb-6 space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Account Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(["student", "lecturer"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all duration-200 ${
                    formData.role === r
                      ? "glow-trust border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/30 hover:bg-muted/40"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                  className={`h-12 rounded-xl border-border/60 bg-background/70 pl-10 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-xs font-medium">
                {formData.role === "student" ? "Student ID" : "Staff ID"}
              </Label>
              <div className="relative">
                <GraduationCap className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => handleChange("studentId", e.target.value)}
                  placeholder={
                    formData.role === "student" ? "UCC123456" : "LECT-2026"
                  }
                  className={`h-12 rounded-xl border-border/60 bg-background/70 pl-10 ${
                    errors.studentId ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="student@university.edu"
                  className={`h-12 rounded-xl border-border/60 bg-background/70 pl-10 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+233 55 000 0000"
                  className={`h-12 rounded-xl border-border/60 bg-background/70 pl-10 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  className={`h-12 rounded-xl border-border/60 bg-background/70 pr-11 pl-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <ShieldCheck className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder="••••••••"
                  className={`h-12 rounded-xl border-border/60 bg-background/70 pl-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-8 h-12 w-full rounded-xl text-sm font-medium shadow-lg transition-all duration-200 hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Creating secure account...
              </>
            ) : (
              <>
                <UserPlus className="size-4" />
                Create Account
              </>
            )}
          </Button>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3 text-accent" />
            Protected with end-to-end encryption
          </div>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/auth/login"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
