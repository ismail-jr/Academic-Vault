// components/dashboard/pipeline-progress.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface PipelineProgressProps {
  graded: number;
  total: number;
}

export function PipelineProgress({ graded, total }: PipelineProgressProps) {
  const percentage = total > 0 ? Math.round((graded / total) * 100) : 0;

  return (
    <Card className="rounded-2xl p-5 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-semibold flex items-center gap-2">
          <Zap className="size-3 text-primary" />
          REVIEW_PIPELINE_STATUS
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          {percentage}% COMPLETE
        </span>
      </div>
      <Progress value={percentage} className="h-1.5 bg-primary/10" />
      <div className="flex justify-between mt-2 px-1">
        {["SUBMITTED", "ENCRYPTED", "VIEWED", "GRADED"].map((step) => (
          <span
            key={step}
            className="text-[8px] font-mono text-muted-foreground"
          >
            {step}
          </span>
        ))}
      </div>
    </Card>
  );
}
