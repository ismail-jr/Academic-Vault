"use client";

import { Card } from "@/components/ui/card";
import { Users, BookOpen, Building2, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value="1,234" trend="+12%" />
        <StatCard icon={BookOpen} label="Courses" value="45" trend="+3" />
        <StatCard icon={Building2} label="Departments" value="8" trend="0" />
        <StatCard
          icon={Activity}
          label="Active Sessions"
          value="342"
          trend="+23"
        />
      </div>

      {/* System Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">
            System Status
          </h2>
          <div className="space-y-3">
            <StatusItem label="Database" status="operational" />
            <StatusItem label="Storage" status="operational" />
            <StatusItem label="Encryption Service" status="operational" />
            <StatusItem label="Email Service" status="degraded" />
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <ActivityItem
              action="User registered"
              user="john@example.com"
              time="2 min ago"
            />
            <ActivityItem
              action="Submission uploaded"
              user="jane@example.com"
              time="15 min ago"
            />
            <ActivityItem
              action="Course created"
              user="admin"
              time="1 hour ago"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <Card className="rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <span className="font-heading text-2xl font-semibold">{value}</span>
          <span className="ml-2 text-xs text-green-600">{trend}</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

function StatusItem({
  label,
  status,
}: {
  label: string;
  status: "operational" | "degraded";
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className={`size-2 rounded-full ${status === "operational" ? "bg-green-500" : "bg-yellow-500"}`}
        />
        <span className="text-xs capitalize">{status}</span>
      </div>
    </div>
  );
}

function ActivityItem({
  action,
  user,
  time,
}: {
  action: string;
  user: string;
  time: string;
}) {
  return (
    <div className="py-2">
      <p className="text-sm font-medium">{action}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {user} • {time}
      </p>
    </div>
  );
}
