"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Moon, Sun, Laptop, Shield } from "lucide-react";

import { LecturerSidebar } from "@/components/dashboard/lecturer-sidebar";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { StudentSidebar } from "@/components/dashboard/student-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserRole = "student" | "lecturer" | "admin";

type Theme = "light" | "dark" | "system";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

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

  // Theme initialization
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "system";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

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
    router.push("/auth/login");
  };

  // Don't render theme-dependent content until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="ml-0 flex min-w-0 flex-1 flex-col lg:ml-72">
      {" "}
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

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative h-9 w-9 rounded-full border-border/60 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                  >
                    {theme === "light" && (
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all" />
                    )}
                    {theme === "dark" && (
                      <Moon className="h-4 w-4 scale-100 transition-all" />
                    )}
                    {theme === "system" && (
                      <Laptop className="h-4 w-4 scale-100 transition-all" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => handleThemeChange("light")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                    {theme === "light" && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleThemeChange("dark")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                    {theme === "dark" && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleThemeChange("system")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Laptop className="h-4 w-4" />
                    <span>System</span>
                    {theme === "system" && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Security Badge (Optional) */}
              <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary md:flex">
                <Shield className="h-3 w-3" />
                <span>Zero-Trust Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
