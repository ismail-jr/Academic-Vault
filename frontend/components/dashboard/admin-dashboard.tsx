"use client";

import { FileLock2, CheckCircle2, Clock3, Upload, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const recentSubmissions = [
  {
    id: 1,
    course: "CS 410 — Cryptography",
    lecturer: "Dr. Sarah Mensah",
    status: "Encrypted & Submitted",
    date: "Today • 11:42 AM",
  },
  {
    id: 2,
    course: "CS 325 — Network Security",
    lecturer: "Prof. Daniel Owusu",
    status: "Reviewed",
    date: "Yesterday • 4:18 PM",
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileLock2} label="Encrypted Files" value="24" />
        <StatCard icon={CheckCircle2} label="Reviewed" value="18" />
        <StatCard icon={Clock3} label="Pending" value="4" />
        <StatCard icon={Bell} label="Notifications" value="7" />
      </div>

      {/* Recent Submissions */}
      <Card className="rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              Recent submissions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest encrypted assignments submitted through Vault.
            </p>
          </div>
          <Link href="/student/submissions">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FileLock2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{submission.course}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Recipient: {submission.lecturer}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {submission.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <span className="font-heading text-2xl font-semibold">{value}</span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}
