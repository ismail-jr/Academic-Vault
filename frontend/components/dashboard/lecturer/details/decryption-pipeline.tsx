"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  KeyRound,
  Lock,
  ShieldCheck,
  Unlock,
  Zap,
  Loader2,
  ArrowRight,
  CheckCircle,
  Shield,
  Check,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Stage = "idle" | "rsa" | "aes" | "done";

interface DecryptionPipelineProps {
  stage: Stage;
  decrypting: boolean;
  decryptedContent: string;
  decryptionSteps?: string[];
  isDecrypted?: boolean;
  onDecrypt: () => void;
}

export function DecryptionPipeline({
  stage,
  decrypting,
  decryptedContent,
  decryptionSteps,
  isDecrypted = false,
  onDecrypt,
}: DecryptionPipelineProps) {
  const canDecrypt = !decrypting && !isDecrypted;

  return (
    <Card className="overflow-hidden rounded-2xl border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold font-mono">
          <Shield className="size-4 text-primary" />
          CRYPTOGRAPHIC_DECRYPTION_PIPELINE
        </h3>

        <div className="relative">
          <div className="absolute top-8 bottom-8 left-5 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          {/* STEP 1 */}
          <div className="relative mb-8 flex items-start gap-4">
            <div
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border-2",
                stage === "rsa" &&
                  !isDecrypted &&
                  "animate-pulse border-primary bg-primary/20",
                isDecrypted && "border-green-500 bg-green-500/20",
                !stage && "border-muted-foreground/30 bg-background",
              )}
            >
              {isDecrypted ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <KeyRound className="size-4 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 pt-1">
              <p className="text-sm font-semibold font-mono">
                RSA-2048_DECRYPTION
              </p>

              <p className="text-[10px] font-mono text-muted-foreground">
                Decrypting AES key using private key
              </p>

              {stage === "rsa" && decrypting && !isDecrypted && (
                <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-primary/20">
                  <div className="h-full w-3/4 animate-pulse bg-primary" />
                </div>
              )}
            </div>

            {stage === "rsa" && decrypting && (
              <Zap className="size-4 animate-pulse text-primary" />
            )}
          </div>

          {/* STEP 2 */}
          <div className="relative mb-8 flex items-start gap-4">
            <div
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border-2",
                stage === "aes" &&
                  !isDecrypted &&
                  "animate-pulse border-primary bg-primary/20",
                isDecrypted && "border-green-500 bg-green-500/20",
                !stage && "border-muted-foreground/30 bg-background",
              )}
            >
              {isDecrypted ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Lock className="size-4 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 pt-1">
              <p className="text-sm font-semibold font-mono">
                AES-256_GCM_DECRYPTION
              </p>

              <p className="text-[10px] font-mono text-muted-foreground">
                Decrypting file content
              </p>

              {stage === "aes" && decrypting && !isDecrypted && (
                <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-primary/20">
                  <div className="h-full w-1/2 animate-pulse bg-primary" />
                </div>
              )}
            </div>

            {stage === "aes" && decrypting && (
              <Zap className="size-4 animate-pulse text-primary" />
            )}
          </div>

          {/* STEP 3 */}
          <div className="relative flex items-start gap-4">
            <div
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border-2",
                isDecrypted && "border-green-500 bg-green-500/20",
                "border-muted-foreground/30",
              )}
            >
              {isDecrypted ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <ShieldCheck className="size-4 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 pt-1">
              <p className="text-sm font-semibold font-mono">VERIFICATION</p>

              <p className="text-[10px] font-mono text-muted-foreground">
                File ready for grading
              </p>
            </div>

            {isDecrypted && <CheckCircle className="size-4 text-green-500" />}
          </div>
        </div>

        {/* ACTION BUTTON */}
        <Button
          onClick={onDecrypt}
          disabled={!canDecrypt}
          className="mt-6 w-full gap-2 font-mono text-sm cursor-pointer hover:bg-primary/90 transition-all duration-200"
        >
          {decrypting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Decrypting...
            </>
          ) : isDecrypted ? (
            <>
              <CheckCircle className="size-4" />
              Already Decrypted
            </>
          ) : (
            <>
              <Unlock className="size-4" />
              Start Decryption
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        {/* OUTPUT */}
        {isDecrypted && decryptedContent && (
          <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="size-4 text-green-500" />
              <span className="text-xs font-mono text-green-600">
                DECRYPTED
              </span>
            </div>

            <pre className="text-xs font-mono whitespace-pre-wrap">
              {decryptedContent}
            </pre>
          </div>
        )}

        {/* STATUS */}
        {isDecrypted && (
          <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
            <p className="text-sm text-green-600 font-mono">
              Decryption completed. Ready for grading.
            </p>

            {decryptionSteps?.map((s, i) => (
              <p
                key={i}
                className="text-[10px] font-mono text-muted-foreground"
              >
                ✓ {s}
              </p>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
