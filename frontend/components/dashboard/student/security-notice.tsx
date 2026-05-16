// components/dashboard/student/security-notice.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";

export function SecurityNotice() {
  return (
    <Card className="rounded-2xl border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Shield className="size-3 text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground">
            END_TO_END_ENCRYPTION_ACTIVE
          </span>
          <Lock className="size-3 text-primary" />
        </div>
        <p className="text-[9px] font-mono text-muted-foreground/70 mt-1">
          All files encrypted with AES-256 | Zero-trust architecture
        </p>
      </div>
    </Card>
  );
}
