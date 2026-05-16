// components/dashboard/lecturer/details/not-found-state.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

export function NotFoundState() {
  return (
    <div className="text-center py-20">
      <XCircle className="mx-auto size-12 text-destructive" />
      <p className="mt-3 font-mono">SUBMISSION_NOT_FOUND</p>
      <Link href="/lecturer/submissions">
        <Button variant="link" className="mt-4 gap-2">
          <ArrowLeft className="size-4" />
          BACK_TO_LIST
        </Button>
      </Link>
    </div>
  );
}
