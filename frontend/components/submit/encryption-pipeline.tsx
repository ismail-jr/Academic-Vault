// components/encryption-pipeline.tsx
"use client";

import {
  Lock,
  KeyRound,
  CloudUpload,
  Check,
  Shield,
  Terminal,
  Cpu,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Stage = "idle" | "encrypt" | "rsa" | "upload" | "done";

interface EncryptionPipelineProps {
  stage: Stage;
  progress: number;
}

const stageLabel: Record<Stage, string> = {
  idle: ">_ AWAITING_COMMAND",
  encrypt: ">_ EXECUTING_AES_256_ENCRYPTION",
  rsa: ">_ WRAPPING_KEY_RSA_2048",
  upload: ">_ TRANSMITTING_CIPHERTEXT",
  done: ">_ PROCESS_COMPLETE",
};

const getStepStatus = (step: Stage, currentStage: Stage) => {
  if (step === currentStage) return "active";
  if (currentStage === "done") return "complete";
  const stepOrder = ["encrypt", "rsa", "upload", "done"];
  const currentIndex = stepOrder.indexOf(currentStage);
  const stepIndex = stepOrder.indexOf(step);
  if (stepIndex < currentIndex) return "complete";
  return "pending";
};

export function EncryptionPipeline({
  stage,
  progress,
}: EncryptionPipelineProps) {
  const steps = [
    {
      id: "encrypt" as Stage,
      label: "AES-256_GCM_ENCRYPT",
      icon: Lock,
      desc: "Generating ciphertext",
    },
    {
      id: "rsa" as Stage,
      label: "RSA_OAEP_WRAP",
      icon: KeyRound,
      desc: "Securing encryption key",
    },
    {
      id: "upload" as Stage,
      label: "SECURE_UPLOAD",
      icon: CloudUpload,
      desc: "Transmitting to vault",
    },
  ];

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hacker Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <CardHeader className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="size-4 text-primary" />
            <span className="text-[10px] font-mono text-primary/70 tracking-wider">
              ENCRYPTION_PIPELINE v2.0
            </span>
            <div className="flex items-center gap-1 ml-2">
              <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-mono text-muted-foreground">
                ACTIVE
              </span>
            </div>
          </div>
          <CardTitle className="text-sm font-mono font-semibold flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            SECURE PROCESSING PIPELINE
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            {`>_ Zero-trust encryption pipeline | Mode: CLIENT_SIDE | Status: ${stage.toUpperCase()}`}
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent>
        {/* Pipeline Steps with Threaded Lines */}
        <div className="relative">
          {/* Vertical threaded line background */}
          <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          {steps.map((step, idx) => {
            const status = getStepStatus(step.id, stage);
            const isActive = status === "active";
            const isComplete = status === "complete";

            return (
              <div
                key={step.id}
                className="relative flex items-start gap-4 mb-8 last:mb-0 group"
              >
                {/* Step Icon with Threaded Connector */}
                <div className="relative z-10">
                  <div
                    className={cn(
                      "size-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isActive &&
                        "border-primary bg-primary/20 shadow-lg shadow-primary/30 animate-pulse",
                      isComplete && "border-green-500 bg-green-500/20",
                      !isActive &&
                        !isComplete &&
                        "border-muted-foreground/30 bg-background",
                    )}
                  >
                    {isComplete ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <step.icon
                        className={cn(
                          "size-4 transition-all",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    )}
                  </div>

                  {/* Threaded vertical line (animated) */}
                  {idx < steps.length - 1 && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-12">
                      <div
                        className={cn(
                          "w-full h-full bg-dashed-vertical animate-flow",
                          isComplete ? "bg-green-500/50" : "bg-primary/30",
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p
                        className={cn(
                          "font-mono text-sm font-semibold",
                          isActive
                            ? "text-primary"
                            : isComplete
                              ? "text-green-500"
                              : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {step.desc}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-mono border",
                        isActive &&
                          "border-primary/50 bg-primary/10 text-primary",
                        isComplete &&
                          "border-green-500/50 bg-green-500/10 text-green-500",
                        !isActive &&
                          !isComplete &&
                          "border-muted-foreground/20 text-muted-foreground",
                      )}
                    >
                      {isActive
                        ? "RUNNING"
                        : isComplete
                          ? "COMPLETE"
                          : "PENDING"}
                    </div>
                  </div>

                  {/* Data stream animation for active step */}
                  {isActive && (
                    <div className="mt-2 relative h-6 overflow-hidden rounded bg-primary/5">
                      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan" />
                      <div className="absolute inset-y-0 left-0 flex items-center gap-1 animate-marquee whitespace-nowrap">
                        {[...Array(10)].map((_, i) => (
                          <span
                            key={i}
                            className="text-[8px] font-mono text-primary/50"
                          >
                            {Math.random()
                              .toString(16)
                              .substring(2, 6)
                              .toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completion checkmark animation */}
                  {isComplete && !isActive && (
                    <div className="mt-2 flex items-center gap-1">
                      <Check className="size-2.5 text-green-500" />
                      <span className="text-[9px] font-mono text-green-500/70">
                        VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Section */}
        {stage !== "idle" && (
          <div className="mt-6 pt-4 border-t border-primary/10 space-y-3 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="size-3 text-primary animate-pulse" />
                <span className="text-[10px] font-mono text-primary/80">
                  {stageLabel[stage]}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-primary">
                {progress}%
              </span>
            </div>

            <div className="relative">
              <Progress value={progress} className="h-1.5 bg-primary/10" />
              <div
                className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary shadow-lg shadow-primary/50 transition-all duration-300"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Progress stats */}
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
              <span>INITIALIZING</span>
              <span>PROCESSING</span>
              <span>FINALIZING</span>
              <span>COMPLETE</span>
            </div>
          </div>
        )}

        {/* Completion Animation */}
        {stage === "done" && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <div className="size-2 rounded-full bg-green-500 animate-ping" />
                <div className="size-2 rounded-full bg-green-500 absolute inset-0" />
              </div>
              <span className="text-xs font-mono text-green-500 font-semibold">
                ✓ SUBMISSION_SUCCESSFUL
              </span>
              <Zap className="size-3 text-green-500 animate-pulse" />
            </div>
            <p className="text-[9px] font-mono text-green-500/70 text-center mt-2">
              Redirecting to dashboard...
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-4 pt-3 text-center">
          <p className="text-[9px] font-mono text-muted-foreground/60 flex items-center justify-center gap-1">
            <Shield className="size-2.5" />
            END_TO_END_ENCRYPTED | AES-256 | RSA-2048 | ZERO_TRUST_ARCHITECTURE
          </p>
        </div>
      </CardContent>

      <style jsx>{`
        .bg-dashed-vertical {
          background-image: repeating-linear-gradient(
            0deg,
            currentColor 0px,
            currentColor 2px,
            transparent 2px,
            transparent 6px
          );
          background-size: 100% 6px;
        }

        .animate-flow {
          animation: flowDown 0.8s linear infinite;
        }

        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }

        .animate-marquee {
          animation: marquee 4s linear infinite;
        }

        @keyframes flowDown {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 12px;
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Card>
  );
}
