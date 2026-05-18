import { useRef } from "react";
import { UploadCloud, FileLock2, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Matches the FormState.file shape from submission-context
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

interface FileDropzoneProps {
  file: UploadedFile | null;
  isDragging: boolean;
  isSubmitting: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, onAccepted: (f: File) => void) => void;
  onFileSelect: (
    e: React.ChangeEvent<HTMLInputElement>,
    onAccepted: (f: File) => void,
  ) => void;
  onFileAccepted: (file: File) => void;
  onRemoveFile: () => void;
  formatFileSize: (bytes: number) => string;
}

export function FileDropzone({
  file,
  isDragging,
  isSubmitting,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onFileAccepted,
  onRemoveFile,
  formatFileSize,
}: FileDropzoneProps) {
  // Use a ref so clicking "browse" text triggers the hidden input
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Upload File</CardTitle>
        <CardDescription>
          Select or drag & drop your assignment file
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Drop zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, onFileAccepted)}
          onClick={() => !isSubmitting && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!isSubmitting) inputRef.current?.click();
            }
          }}
          aria-label="Upload file"
          className={`relative rounded-lg border-2 border-dashed transition-all duration-200 p-10 text-center cursor-pointer select-none ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          } ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
        >
          {/* Hidden file input — controlled via ref */}
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx,.zip,.txt,.pptx,.xlsx"
            onChange={(e) => {
              onFileSelect(e, onFileAccepted);
              // Reset input so the same file can be re-selected if removed
              e.target.value = "";
            }}
            disabled={isSubmitting}
          />

          <div className="size-14 rounded-full bg-primary/15 text-primary grid place-items-center mx-auto mb-4">
            <UploadCloud className="size-7" />
          </div>

          <p className="text-sm font-medium text-foreground">
            Drop your file here, or{" "}
            <span className="text-primary hover:underline">browse</span>
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            PDF, DOCX, ZIP, TXT, PPTX, XLSX — up to 50 MB
          </p>
        </div>

        {/* Selected file preview */}
        {file && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-accent/5 p-3 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-lg bg-primary/15 text-primary grid place-items-center shrink-0">
                <FileLock2 className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)} · Ready for encryption
                </p>
              </div>
            </div>

            {!isSubmitting && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent re-opening the file dialog
                  onRemoveFile();
                }}
                aria-label="Remove file"
                className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors shrink-0"
              >
                <X className="size-4 text-muted-foreground hover:text-destructive" />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
