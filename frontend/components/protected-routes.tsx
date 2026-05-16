// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("student" | "lecturer" | "admin")[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo || "/auth/login");
        return;
      }

      // Authenticated but role not allowed
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardRoute = `/${user.role}/dashboard`;
        router.push(dashboardRoute);
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, redirectTo]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - don't render children
  if (!isAuthenticated) {
    return null;
  }

  // Role check - if allowedRoles specified and user role not included
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="size-8 text-destructive" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push(`/${user?.role}/dashboard`)}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
