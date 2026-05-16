// components/submissions/EmptyState.tsx
"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <FileText className="mx-auto size-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No submissions found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {hasFilters
            ? "Try adjusting your filters"
            : "You haven't submitted any assignments yet"}
        </p>
        {!hasFilters && (
          <Link href="/student/submit">
            <Button>Submit Your First Assignment</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
