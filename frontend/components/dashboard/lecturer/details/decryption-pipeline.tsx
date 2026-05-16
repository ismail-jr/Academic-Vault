// components/dashboard/lecturer/details/decryption-pipeline.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check,
  KeyRound,
  Lock,
  ShieldCheck,
  Unlock,
  Zap,
  Loader2,
  ArrowRight,
  CheckCircle,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Stage = "idle" | "rsa" | "aes" | "done";

interface DecryptionPipelineProps {
  stage: Stage;
  decrypting: boolean;
  decryptedContent: string;
  onDecrypt: () => void;
}

export function DecryptionPipeline({
  stage,
  decrypting,
  decryptedContent,
  onDecrypt,
}: DecryptionPipelineProps) {
  return (
    <Card className="rounded-2xl overflow-hidden border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-6">
        <h3 className="text-sm font-mono font-semibold mb-4 flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          CRYPTOGRAPHIC_DECRYPTION_PIPELINE
        </h3>

        <div className="relative">
          <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          {/* Step 1: RSA */}
          <div className="relative flex items-start gap-4 mb-8">
            <div
              className={cn(
                "relative z-10 size-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                stage === "rsa" &&
                  "border-primary bg-primary/20 shadow-lg shadow-primary/30 animate-pulse",
                stage === "aes" || stage === "done"
                  ? "border-green-500 bg-green-500/20"
                  : "border-muted-foreground/30 bg-background",
              )}
            >
              {stage === "aes" || stage === "done" ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <KeyRound
                  className={cn(
                    "size-4",
                    stage === "rsa" ? "text-primary" : "text-muted-foreground",
                  )}
                />
              )}
            </div>
            <div className="flex-1 pt-1">
              <p
                className={cn(
                  "font-mono text-sm font-semibold",
                  stage === "rsa" && "text-primary",
                )}
              >
                RSA-2048_DECRYPTION
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                Decrypting AES-256 key using lecturer's private key
              </p>
              {stage === "rsa" && (
                <div className="mt-2 h-1 w-32 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full animate-pulse" />
                </div>
              )}
            </div>
            {stage === "rsa" && (
              <Zap className="size-4 text-primary animate-pulse" />
            )}
          </div>

          {/* Step 2: AES */}
          <div className="relative flex items-start gap-4 mb-8">
            <div
              className={cn(
                "relative z-10 size-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                stage === "aes" &&
                  "border-primary bg-primary/20 shadow-lg shadow-primary/30 animate-pulse",
                stage === "done"
                  ? "border-green-500 bg-green-500/20"
                  : "border-muted-foreground/30 bg-background",
              )}
            >
              {stage === "done" ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Lock
                  className={cn(
                    "size-4",
                    stage === "aes" ? "text-primary" : "text-muted-foreground",
                  )}
                />
              )}
            </div>
            <div className="flex-1 pt-1">
              <p
                className={cn(
                  "font-mono text-sm font-semibold",
                  stage === "aes" && "text-primary",
                )}
              >
                AES-256_GCM_DECRYPTION
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                Decrypting file content using authenticated encryption
              </p>
              {stage === "aes" && (
                <div className="mt-2 h-1 w-32 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-primary rounded-full animate-pulse" />
                </div>
              )}
            </div>
            {stage === "aes" && (
              <Zap className="size-4 text-primary animate-pulse" />
            )}
          </div>

          {/* Step 3: Complete */}
          <div className="relative flex items-start gap-4">
            <div
              className={cn(
                "relative z-10 size-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                stage === "done" &&
                  "border-green-500 bg-green-500/20 shadow-lg shadow-green-500/30",
                "border-muted-foreground/30 bg-background",
              )}
            >
              {stage === "done" ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <ShieldCheck className="size-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 pt-1">
              <p
                className={cn(
                  "font-mono text-sm font-semibold",
                  stage === "done" && "text-green-500",
                )}
              >
                VERIFICATION_COMPLETE
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                File ready for review and grading
              </p>
            </div>
            {stage === "done" && (
              <CheckCircle className="size-4 text-green-500" />
            )}
          </div>
        </div>

        {stage !== "done" && (
          <Button
            onClick={onDecrypt}
            disabled={decrypting || stage !== "idle"}
            className="mt-6 w-full gap-2 font-mono"
            variant={decrypting ? "secondary" : "default"}
          >
            {decrypting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                DECRYPTING...
              </>
            ) : (
              <>
                <Unlock className="size-4" />
                INITIATE_DECRYPTION_SEQUENCE
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        )}

        {stage === "done" && decryptedContent && (
          <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="size-4 text-green-500" />
              <span className="text-xs font-mono font-semibold text-green-500">
                DECRYPTION_SUCCESSFUL
              </span>
            </div>
            <pre className="text-xs font-mono bg-black/20 p-3 rounded overflow-auto max-h-64 whitespace-pre-wrap">
              {decryptedContent}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}
