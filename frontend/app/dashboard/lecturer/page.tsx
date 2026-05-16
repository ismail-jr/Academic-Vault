"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, CheckCircle2, Users, Clock3 } from "lucide-react";
import Link from "next/link";

const pendingSubmissions = [
  {
    id: 1,
    student: "John Doe",
    course: "CS 410",
    submitted: "Today • 10:30 AM",
  },
  {
    id: 2,
    student: "Jane Smith",
    course: "CS 325",
    submitted: "Yesterday • 3:15 PM",
  },
];

export default function LecturerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Incoming" value="12" />
        <StatCard icon={CheckCircle2} label="Reviewed" value="48" />
        <StatCard icon={Clock3} label="Pending Review" value="8" />
        <StatCard icon={Users} label="Students" value="156" />
      </div>

      {/* Pending Submissions */}
      <Card className="rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              Pending Submissions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Assignments waiting for review
            </p>
          </div>
          <Link href="/lecturer/incoming">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {pendingSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between p-6"
            >
              <div>
                <h3 className="font-medium">{submission.student}</h3>
                <p className="text-sm text-muted-foreground">
                  {submission.course}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {submission.submitted}
                </p>
              </div>
              <Link href={`/lecturer/grade/${submission.id}`}>
                <Button size="sm">Review</Button>
              </Link>
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
