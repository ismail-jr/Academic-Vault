"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LecturerSidebar } from "@/components/dashboard/lecturer-sidebar";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { StudentSidebar } from "@/components/dashboard/student-sidebar";

type UserRole = "student" | "lecturer" | "admin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [userName, setUserName] = useState("John Doe");

  // Get role from pathname
  useEffect(() => {
    if (pathname.startsWith("/lecturer")) {
      setUserRole("lecturer");
    } else if (pathname.startsWith("/admin")) {
      setUserRole("admin");
    } else {
      setUserRole("student");
    }
  }, [pathname]);

  const getSidebar = () => {
    switch (userRole) {
      case "lecturer":
        return <LecturerSidebar />;
      case "admin":
        return <AdminSidebar />;
      default:
        return <StudentSidebar />;
    }
  };

  const getTitle = () => {
    switch (userRole) {
      case "lecturer":
        return "Lecturer Portal";
      case "admin":
        return "Admin Control Panel";
      default:
        return "Student Portal";
    }
  };

  const handleLogout = () => {
    // Clear auth token
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* SIDEBAR */}
      {getSidebar()}

      {/* MAIN CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-6 lg:px-8">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                {getTitle()}
              </h1>
              <p className="text-sm text-muted-foreground">
                {userRole === "student" &&
                  "Manage your assignments and submissions"}
                {userRole === "lecturer" &&
                  "Review and grade student submissions"}
                {userRole === "admin" &&
                  "Manage users, courses, and system settings"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Security Badge */}
              <div className="hidden items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 sm:flex">
                <Shield className="size-4 text-accent-foreground" />
                <span className="text-xs font-medium text-accent-foreground">
                  Secure Connection
                </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-3 py-2 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {userName.charAt(0)}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userRole}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-xl"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
