// components/dashboard/student/quick-actions.tsx
"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Upload, Eye } from "lucide-react";

export function StudentQuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link href="/student/submit">
        <Card className="rounded-2xl p-5 border border-primary/20 transition-all duration-300 cursor-pointer group hover:border-primary/50 hover:bg-primary/5">
          <div className="flex items-start justify-between">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-primary">
              <Upload className="size-5" />
            </div>
          </div>
          <h3 className="font-mono font-semibold text-sm mt-2">SUBMIT_WORK</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Upload and encrypt your assignment
          </p>
        </Card>
      </Link>

      <Link href="/student/submissions">
        <Card className="rounded-2xl p-5 border border-primary/20 transition-all duration-300 cursor-pointer group hover:border-primary/50 hover:bg-primary/5">
          <div className="flex items-start justify-between">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-primary">
              <Eye className="size-5" />
            </div>
          </div>
          <h3 className="font-mono font-semibold text-sm mt-2">VIEW_WORK</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Track your submission status
          </p>
        </Card>
      </Link>
    </div>
  );
}
