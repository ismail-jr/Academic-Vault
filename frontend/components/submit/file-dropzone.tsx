import { UploadCloud, FileLock2, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FileDropzoneProps {
  file: File | null;
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Upload File</CardTitle>
        <CardDescription>
          Select or drag & drop your assignment file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, onFileAccepted)}
          className={`relative rounded-lg border-2 border-dashed transition-all duration-200 p-10 text-center ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border"
          }`}
        >
          <input
            id="file"
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => onFileSelect(e, onFileAccepted)}
            disabled={isSubmitting}
          />
          <div className="size-14 rounded-full bg-primary/15 text-primary grid place-items-center mx-auto mb-4">
            <UploadCloud className="size-7" />
          </div>
          <div className="text-sm font-medium">
            Drop your file here, or{" "}
            <span className="text-primary cursor-pointer hover:underline">
              browse
            </span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            PDF, DOCX, ZIP, TXT — up to 50 MB
          </div>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-accent/5 p-3 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-lg bg-primary/15 text-primary grid place-items-center">
                <FileLock2 className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)} · Ready for encryption
                </div>
              </div>
            </div>
            {!isSubmitting && (
              <button
                type="button"
                onClick={onRemoveFile}
                className="p-1 rounded-lg hover:bg-destructive/10 transition-colors"
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
