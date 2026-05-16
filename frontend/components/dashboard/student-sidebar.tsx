"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Upload,
  FileLock2,
  Settings,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboardIcon,
  BookLock,
  ClipboardList,
  Award,
  Clock,
  Bell,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const studentNav = [
  {
    href: "/student/dashboard",
    label: "Overview",
    icon: LayoutDashboardIcon,
    description: "Dashboard & Stats",
  },
  {
    href: "/student/submit",
    label: "Submit Work",
    icon: Upload,
    description: "Upload Assignment",
  },
  {
    href: "/student/submissions",
    label: "My Work",
    icon: ClipboardList,
    description: "Track Submissions",
  },
  // {
  //   href: "/student/grades",
  //   label: "Grades",
  //   icon: Award,
  //   description: "View Scores",
  // },
  // {
  //   href: "/student/deadlines",
  //   label: "Deadlines",
  //   icon: Clock,
  //   description: "Upcoming Due Dates",
  // },
  // {
  //   href: "/student/notifications",
  //   label: "Notifications",
  //   icon: Bell,
  //   description: "Updates & Alerts",
  // },
  // {
  //   href: "/student/help",
  //   label: "Help",
  //   icon: HelpCircle,
  //   description: "Support & Guides",
  // },
];

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const getAvatarUrl = () => null;

  const isActiveLink = (href: string) => {
    if (href === "/student/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-xl">
            <BookLock className="size-5 text-primary-foreground" />
          </div>
          <div className="space-y-0.5">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
              Vault
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-sidebar-foreground/60">
              Student Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-1">
            {studentNav.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg transition-all duration-200",
                      isActive
                        ? "text-primary"
                        : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm">{item.label}</span>
                    <p className="text-[10px] text-muted-foreground/60">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Profile Section with Avatar and Logout */}
          <div className="mt-6 border-t border-sidebar-border pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group w-full rounded-xl p-2 transition-all duration-200 hover:bg-sidebar-accent/60">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <Avatar className="size-10 ring-2 ring-sidebar-border ring-offset-2 ring-offset-sidebar transition-all group-hover:ring-primary">
                      <AvatarImage src={getAvatarUrl() || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold text-primary">
                        {user?.name ? getInitials(user.name) : "ST"}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-sidebar-foreground">
                        {user?.name?.split(" ")[0] || "Student"}
                      </p>
                      <p className="text-xs text-sidebar-foreground/60">
                        {user?.studentId || user?.email || "Student"}
                      </p>
                    </div>

                    {/* Chevron Icon */}
                    <ChevronDown className="size-4 text-sidebar-foreground/40 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64" align="end" sideOffset={5}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {user?.name || "Student User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "student@university.edu"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/student/profile" className="cursor-pointer">
                    <User className="mr-2 size-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/student/settings" className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowLogoutDialog(true)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <div className="mr-2 size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
