"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileLock2,
  Lock,
  KeyRound,
  CloudUpload,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SecurityChip } from "@/components/StatusBadge";
import { lecturers } from "@/lib/mock-data";

type Stage = "idle" | "encrypt" | "rsa" | "upload" | "done";

function PipelineStep({
  label,
  icon: Icon,
  active,
  done,
}: {
  label: string;
  icon: typeof Lock;
  active: boolean;
  done: boolean;
}) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <div
        className={`size-8 rounded-md grid place-items-center border ${
          done
            ? "bg-accent/15 border-accent/40 text-accent"
            : active
              ? "bg-primary/15 border-primary/40 text-primary animate-pulse"
              : "bg-secondary border-border text-muted-foreground"
        }`}
      >
        {done ? <Check className="size-4" /> : <Icon className="size-4" />}
      </div>
      <span
        className={done || active ? "text-foreground" : "text-muted-foreground"}
      >
        {label}
      </span>
    </li>
  );
}

export default function SubmitPage() {
  const router = useRouter();
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [drag, setDrag] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [course, setCourse] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState(lecturers[0]);

  const onFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    setFile({ name: files[0].name, size: files[0].size });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const steps: Stage[] = ["encrypt", "rsa", "upload", "done"];
    for (const s of steps) {
      setStage(s);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    // Here you would actually upload the file to your API
    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("course", course);
    // formData.append("lecturer", selectedLecturer);
    // await fetch("/api/submissions", { method: "POST", body: formData });

    router.push("/student/submission-success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Submit Assignment
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Files are encrypted in your browser before upload.
        </p>
      </div>

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* File Dropzone */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                onFiles(e.dataTransfer.files);
              }}
              className={`relative rounded-lg border-2 border-dashed transition-colors p-10 text-center ${
                drag ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <input
                id="file"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => onFiles(e.target.files)}
              />
              <div className="size-12 rounded-full bg-primary/15 text-primary grid place-items-center mx-auto">
                <UploadCloud className="size-6" />
              </div>
              <div className="mt-4 text-sm font-medium">
                Drop your file here, or{" "}
                <span className="text-primary">browse</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                PDF, DOCX, ZIP — up to 50 MB. Encrypted client-side with
                AES-256.
              </div>
            </div>

            {file && (
              <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-secondary/40 p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-md bg-primary/15 text-primary grid place-items-center">
                    <FileLock2 className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB · ready to encrypt
                    </div>
                  </div>
                </div>
                <SecurityChip label="AES-256" />
              </div>
            )}
          </div>

          {/* Assignment Details */}
          <div className="rounded-xl border border-border bg-card p-6 grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Recipient Lecturer</Label>
              <Select
                value={selectedLecturer}
                onValueChange={setSelectedLecturer}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map((lecturer) => (
                    <SelectItem key={lecturer} value={lecturer}>
                      {lecturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Course Code / Name</Label>
              <Input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. CS 410 — Cryptography"
                className="rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold">Encryption Pipeline</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Each step runs locally before any byte leaves your device.
            </p>
            <ul className="mt-5 space-y-3">
              <PipelineStep
                label="Encrypting file (AES-256)"
                icon={Lock}
                active={stage === "encrypt"}
                done={["rsa", "upload", "done"].includes(stage)}
              />
              <PipelineStep
                label="Securing key (RSA-OAEP)"
                icon={KeyRound}
                active={stage === "rsa"}
                done={["upload", "done"].includes(stage)}
              />
              <PipelineStep
                label="Uploading ciphertext"
                icon={CloudUpload}
                active={stage === "upload"}
                done={stage === "done"}
              />
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={!file || stage !== "idle" || !course}
          >
            <Lock className="size-4 mr-2" />
            {stage === "idle" ? "Encrypt & Submit" : "Processing..."}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            By submitting you confirm the recipient lecturer is correct. Keys
            cannot be re-issued.
          </p>
        </aside>
      </form>
    </div>
  );
}
