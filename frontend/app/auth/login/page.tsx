"use client";

import { useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";

import {
  Shield,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

type Role = "student" | "lecturer";

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();

  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (!identifier.trim()) {
      toast.error(
        role === "student"
          ? "Email or Student ID is required"
          : "Email is required",
      );
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await login({
        identifier,
        password,
      });

      if (!result.success) {
        return;
      }

      toast.success("Login successful!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || authLoading;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* BACKGROUND */}
      <div className="absolute inset-0 encrypted-overlay opacity-60" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.16_235/0.12),transparent_30%),radial-gradient(circle_at_bottom_right,oklch(0.72_0.17_160/0.10),transparent_35%)]" />

      <div className="relative grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT PANEL */}
        <div className="hidden border-r border-border/60 lg:flex">
          <div className="flex h-full w-full flex-col justify-between p-12">
            {/* LOGO */}
            <div className="flex items-center gap-4">
              <div className="glow-trust flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-trust shadow-2xl">
                <Shield className="size-7 text-primary-foreground" />
              </div>

              <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  Vault
                </h1>

                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Zero-Trust Academic Submission
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-xl space-y-10">
              <div className="space-y-6 py-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-xs font-medium backdrop-blur-sm">
                  <span className="size-2 animate-pulse rounded-full bg-success" />
                  Secure encrypted access
                </div>

                <h2 className="font-heading text-5xl font-semibold leading-tight tracking-tight">
                  Sign in to your{" "}
                  <span className="text-primary">secure workspace</span>
                </h2>

                <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                  Every upload is encrypted before it reaches the server. Your
                  files remain private, protected, and accessible only to
                  authorized lecturers.
                </p>
              </div>

              {/* FEATURES */}
              <div className="space-y-4">
                <div className="shadow-card flex items-start gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
                  <div className="glow-trust flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <Lock className="size-5 text-primary" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium">AES-256 Encryption</h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Files are encrypted client-side before transmission.
                    </p>
                  </div>
                </div>

                <div className="shadow-card flex items-start gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
                  <div className="glow-accent flex size-10 items-center justify-center rounded-xl bg-accent/15">
                    <KeyRound className="size-5 text-accent-foreground" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium">RSA Key Wrapping</h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Encryption keys are securely wrapped per recipient.
                    </p>
                  </div>
                </div>

                <div className="shadow-card flex items-start gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
                  <div className="glow-trust flex size-10 items-center justify-center rounded-xl bg-success/10">
                    <ShieldCheck className="size-5 text-success" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium">Tamper-Evident Audit Trail</h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Every submission is securely logged and verifiable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-border/60 pt-6 text-xs text-muted-foreground">
              <p>© 2026 Vault</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubmit}
              className="shadow-card relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-2xl sm:p-10"
            >
              {/* TOP GLOW */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />

              {/* MOBILE BRAND */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="glow-trust flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-trust">
                  <Shield className="size-5 text-primary-foreground" />
                </div>

                <div>
                  <h1 className="font-heading text-lg font-semibold">Vault</h1>

                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Secure Access
                  </p>
                </div>
              </div>

              {/* HEADER */}
              <div className="mb-8 space-y-3 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                  <ShieldCheck className="size-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-heading text-3xl font-semibold tracking-tight">
                    Welcome back
                  </h2>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Sign in to access your encrypted academic dashboard.
                  </p>
                </div>
              </div>

              {/* ROLE */}
              <div className="mb-6 space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account Type
                </Label>

                <div className="grid grid-cols-2 rounded-2xl border border-border/60 bg-muted/40 p-1">
                  {(["student", "lecturer"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-xl px-4 py-3 text-sm font-medium capitalize transition-all duration-300 ${
                        role === r
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* IDENTIFIER */}
              <div className="mb-5 space-y-2">
                <Label
                  htmlFor="identifier"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {role === "student" ? "Email or Student ID" : "Email Address"}
                </Label>

                <div className="relative">
                  <UserCircle2 className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      role === "student"
                        ? "student@university.edu or UCC123456"
                        : "lecturer@university.edu"
                    }
                    className="h-12 rounded-2xl border-border/60 bg-background/60 pl-11 backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-6 space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </Label>

                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-2xl border-border/60 bg-background/60 pl-11 pr-11 backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:ring-ring"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-2xl text-sm font-medium shadow-lg transition-all duration-300 hover:scale-[1.01]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="size-4" />
                    Sign in securely
                  </div>
                )}
              </Button>

              {/* FOOTER */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3 text-success" />
                  End-to-end encrypted session
                </div>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                  </span>

                  <Link
                    href="/auth/register"
                    className="font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
