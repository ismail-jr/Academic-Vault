"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FileLock2,
  Settings,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboardIcon,
  BookLock,
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

const lecturerNav = [
  {
    href: "/lecturer/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  { href: "/lecturer/submissions", label: "Submissions", icon: FileLock2 },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export function LecturerSidebar() {
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
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const getAvatarUrl = () => null;

  return (
    <>
      <aside className="hidden w-72 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-xl">
            <BookLock className="size-5 text-primary-foreground" />
          </div>
          <div className="space-y-0.5">
            <h2 className="font-heading text-lg font-semibold text-sidebar-foreground">
              Vault
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-sidebar-foreground/60">
              Lecturer Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-2">
            {lecturerNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "border-sidebar-ring/40 bg-sidebar-accent text-sidebar-accent-foreground shadow-lg"
                      : "border-transparent text-sidebar-foreground/70 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "bg-sidebar-accent/40 text-sidebar-foreground/70 group-hover:bg-sidebar-accent group-hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="mt-6 border-t border-sidebar-border pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group w-full rounded-xl p-2 transition-all duration-200 hover:bg-sidebar-accent/60">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-sidebar-border ring-offset-2 ring-offset-sidebar transition-all group-hover:ring-sidebar-ring">
                      <AvatarImage src={getAvatarUrl() || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-sidebar-primary/20 to-sidebar-primary/5 text-sm font-semibold text-sidebar-primary">
                        {user?.name ? getInitials(user.name) : "LE"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-sidebar-foreground">
                        {user?.name?.split(" ")[0] || "Lecturer"}
                      </p>
                      <p className="text-xs text-sidebar-foreground/60">
                        {user?.email || "lecturer@university.edu"}
                      </p>
                    </div>

                    <ChevronDown className="size-4 text-sidebar-foreground/40 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64" align="end" sideOffset={5}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {user?.name || "Lecturer User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "lecturer@university.edu"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/lecturer/profile" className="cursor-pointer">
                    <User className="mr-2 size-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lecturer/settings" className="cursor-pointer">
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
