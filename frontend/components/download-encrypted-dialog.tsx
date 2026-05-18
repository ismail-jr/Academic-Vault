"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Download, Shield, Lock, AlertTriangle, FileText } from "lucide-react";

interface DownloadEncryptedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDownloading?: boolean;
  fileName?: string;
}

export function DownloadEncryptedDialog({
  open,
  onOpenChange,
  onConfirm,
  isDownloading = false,
  fileName,
}: DownloadEncryptedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border-border">
        <DialogHeader>
          <div className="mb-4 flex items-center justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="size-7 text-primary" />
            </div>
          </div>

          <DialogTitle className="text-center text-xl font-semibold">
            Download Encrypted File
          </DialogTitle>

          <DialogDescription className="text-center text-sm leading-relaxed">
            This submission will be downloaded in its encrypted format for
            secure access and storage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 size-5 text-muted-foreground" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Encrypted Submission</p>

                <p className="truncate text-xs text-muted-foreground">
                  {fileName || "submission.enc"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1 rounded-md px-3 py-1">
              <Shield className="size-3" />
              AES-256
            </Badge>

            <Badge variant="outline" className="gap-1 rounded-md px-3 py-1">
              <Lock className="size-3" />
              End-to-End Encrypted
            </Badge>
          </div>

          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 size-5 text-yellow-600" />

              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  Secure File Notice
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  You may need the appropriate decryption key or system access
                  to open this file after download.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDownloading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isDownloading}
            className="w-full sm:w-auto gap-2 font-mono text-sm cursor-pointer hover:bg-primary/90 transition-all duration-200"
          >
            <Download className="mr-2 size-4" />

            {isDownloading ? "Downloading..." : "Download Encrypted File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
