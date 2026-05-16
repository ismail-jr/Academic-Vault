"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  ScrollText,
  Settings,
  Shield,
  BarChart3,
  Database,
  BellRing,
  Key,
  FileText,
  UserCog,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    description: "System Dashboard",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    description: "Manage Accounts",
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: BookOpen,
    description: "Manage Curriculum",
  },
  {
    href: "/admin/departments",
    label: "Departments",
    icon: Building2,
    description: "Organization Structure",
  },
  {
    href: "/admin/faculty",
    label: "Faculty",
    icon: UserCog,
    description: "Lecturer Management",
  },
  {
    href: "/admin/students",
    label: "Enrollment",
    icon: GraduationCap,
    description: "Student Records",
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Reports & Stats",
  },
  {
    href: "/admin/security",
    label: "Security",
    icon: Key,
    description: "Access Control",
  },
  {
    href: "/admin/audit",
    label: "Audit Logs",
    icon: ScrollText,
    description: "Activity Tracking",
  },
  {
    href: "/admin/backups",
    label: "Backups",
    icon: Database,
    description: "Data Protection",
  },
  {
    href: "/admin/notifications",
    label: "Alerts",
    icon: BellRing,
    description: "System Notifications",
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: FileText,
    description: "Generate Reports",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    description: "System Config",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-xl">
          <Shield className="size-5 text-primary-foreground" />
        </div>
        <div className="space-y-0.5">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
            Vault
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-sidebar-foreground/60">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        <nav className="space-y-1">
          {adminNav.map((item) => {
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
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-xl bg-sidebar-accent/40 p-3">
          <div className="flex items-center gap-2">
            <Shield className="size-3 text-primary" />
            <p className="text-[10px] font-mono text-sidebar-foreground/60">
              SYSTEM_ADMIN_MODE
            </p>
          </div>
          <p className="text-[9px] text-sidebar-foreground/40 mt-1 leading-relaxed">
            Full audit capabilities enabled
          </p>
        </div>
      </div>
    </aside>
  );
}
