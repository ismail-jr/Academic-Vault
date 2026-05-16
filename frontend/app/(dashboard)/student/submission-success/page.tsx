// app/student/submission-success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  ArrowLeft,
  Shield,
  FileText,
  Lock,
  Eye,
  Clock,
  Home,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function SubmissionSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const submissionDetails = {
    id: "SUB-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    timestamp: new Date().toLocaleString(),
    encryption: "AES-256-GCM",
    keyExchange: "RSA-2048",
    status: "ENCRYPTED",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 size-2 rounded-full bg-primary/20 animate-ping" />
        <div className="absolute top-40 right-20 size-3 rounded-full bg-green-500/20 animate-ping delay-300" />
        <div className="absolute bottom-20 left-1/4 size-1.5 rounded-full bg-primary/30 animate-ping delay-700" />
        <div className="absolute top-1/2 right-1/3 size-2 rounded-full bg-accent/20 animate-ping delay-500" />
      </div>

      <Card className="relative max-w-2xl w-full overflow-hidden border-primary/20 shadow-2xl animate-in zoom-in-95 duration-500">
        {/* Success Header with Glow */}
        <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)/0.2,transparent)]" />

          {/* Animated Checkmark */}
          <div className="relative inline-flex">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <div className="relative size-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="size-12 text-green-500 animate-bounce" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mt-4 font-mono">
            SUBMISSION_SUCCESSFUL
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Your file has been encrypted and securely uploaded
          </p>
        </div>

        {/* Encryption Details */}
        <div className="p-6 space-y-6">
          {/* Security Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="gap-1 py-1.5 px-3 bg-primary/5">
              <Shield className="size-3" />
              {submissionDetails.encryption}
            </Badge>
            <Badge variant="outline" className="gap-1 py-1.5 px-3 bg-primary/5">
              <Lock className="size-3" />
              {submissionDetails.keyExchange}
            </Badge>
            <Badge
              variant="outline"
              className="gap-1 py-1.5 px-3 bg-green-500/10 text-green-600"
            >
              <CheckCircle className="size-3" />
              {submissionDetails.status}
            </Badge>
          </div>

          {/* Submission Info */}
          <div className="space-y-3 bg-muted/30 rounded-lg p-4 border border-primary/10">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="size-3" />
              SUBMISSION_DETAILS
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-xs">
                  Submission ID:
                </span>
                <span className="font-mono text-xs font-bold">
                  {submissionDetails.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-xs">
                  Timestamp:
                </span>
                <span className="font-mono text-xs">
                  {submissionDetails.timestamp}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-xs">
                  Encryption Status:
                </span>
                <Badge
                  variant="outline"
                  className="gap-1 bg-green-500/10 text-green-600"
                >
                  <Lock className="size-2.5" />
                  END_TO_END_ENCRYPTED
                </Badge>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Clock className="size-3" />
              WHAT_HAPPENS_NEXT
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="size-3 text-primary" />
                </div>
                <div>
                  <p className="font-medium">File is securely stored</p>
                  <p className="text-xs text-muted-foreground">
                    Your encrypted file is stored on our secure servers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="size-3 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Lecturer will review</p>
                  <p className="text-xs text-muted-foreground">
                    Only your assigned lecturer can decrypt and view
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileCheck className="size-3 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Get notified when graded</p>
                  <p className="text-xs text-muted-foreground">
                    You'll receive updates when your submission is reviewed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auto redirect progress */}
          {/* <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Redirecting to dashboard in {countdown} seconds...</span>
              <span className="font-mono">
                {countdown > 0 ? `[${countdown}]` : "[0]"}
              </span>
            </div>
            <Progress value={(countdown / 5) * 100} className="h-1" />
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-primary/10 p-6 flex flex-wrap gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/student/submissions">
              <FileText className="size-4" />
              View Submissions
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/student/dashboard">
              <Home className="size-4" />
              Dashboard
            </Link>
          </Button>
        </div>

        {/* Security Footer */}
        <div className="bg-primary/5 px-6 py-3 text-center">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="size-2.5" />
            ZERO_TRUST_ARCHITECTURE | CLIENT_SIDE_ENCRYPTION | AES_256 |
            RSA_2048
            <Sparkles className="size-2.5" />
          </p>
        </div>
      </Card>
    </div>
  );
}
