import { useState, useCallback } from "react";
import { toast } from "sonner";

interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useFileUpload(options: FileValidationOptions = {}) {
  const {
    maxSizeMB = 50,
    allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "text/plain",
    ],
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File) => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        setError(`File too large. Max ${maxSizeMB}MB`);
        toast.error(`File too large. Max ${maxSizeMB}MB`);
        return false;
      }

      const isValidType =
        allowedTypes.includes(file.type) ||
        allowedTypes.some((t) =>
          file.name.toLowerCase().endsWith(t.split("/").pop() || ""),
        );

      if (!isValidType) {
        setError("Unsupported file type");
        toast.error("Unsupported file type");
        return false;
      }

      setError(null);
      return true;
    },
    [maxSizeMB, allowedTypes],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, onFileAccepted: (file: File) => void) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && validateFile(file)) onFileAccepted(file);
    },
    [validateFile],
  );

  const handleFileSelect = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onFileAccepted: (file: File) => void,
    ) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) onFileAccepted(file);
    },
    [validateFile],
  );

  const formatFileSize = useCallback((bytes: number) => {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  }, []);

  return {
    isDragging,
    error,
    validateFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    formatFileSize,
  };
}
