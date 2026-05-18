"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSubmission } from "@/contexts/submission-context";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/contexts/auth-context";
import { usersAPI, type Lecturer } from "@/lib/api/users";
import { toast } from "sonner";

import { FileDropzone } from "@/components/submit/file-dropzone";
import { AssignmentDetailsForm } from "@/components/submit/submit-form";
import { EncryptionPipeline } from "@/components/submit/encryption-pipeline";
import { SubmissionChecklist } from "@/components/submit/checklist";
import { SubmitButton } from "@/components/submit/btn";

export default function SubmitPage() {
  const router = useRouter();
  const { token } = useAuth();

  const {
    submission,
    stage,
    isSubmitting,
    progress,
    setFile,
    setCourseInfo,
    setLecturer,
    setAssignmentInfo,
    submitSubmission,
    resetSubmission,
  } = useSubmission();

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLecturerId, setSelectedLecturerId] = useState("");

  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [lecturerError, setLecturerError] = useState<string | null>(null);

  const {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    formatFileSize,
  } = useFileUpload({ maxSizeMB: 50 });

  // Fetch lecturers
  useEffect(() => {
    if (!token) {
      setLoadingLecturers(false);
      return;
    }

    const fetchLecturers = async () => {
      try {
        setLoadingLecturers(true);
        setLecturerError(null);

        const res = await usersAPI.getLecturers(token);

        if (res.success && res.lecturers) {
          setLecturers(res.lecturers);
        } else {
          setLecturerError(res.message || "Failed to load lecturers");
          toast.error("Could not load lecturers");
        }
      } catch {
        setLecturerError("Failed to load lecturers");
        toast.error("Failed to load lecturers");
      } finally {
        setLoadingLecturers(false);
      }
    };

    fetchLecturers();
  }, [token]);

  // File accepted
  const handleFileAccepted = (file: File) => {
    setFile(file);
    toast.success(`"${file.name}" selected`);
  };

  // Lecturer change
  const handleLecturerChange = (value: string) => {
    setSelectedLecturerId(value);

    const lecturer = lecturers.find((l) => l._id === value);

    if (lecturer) {
      setLecturer(lecturer._id, lecturer.name);
    }
  };

  // Course code
  const handleCourseCodeChange = (value: string) => {
    const upper = value.toUpperCase();

    setCourseCode(upper);

    setCourseInfo(upper, courseName);
  };

  // Course name
  const handleCourseNameChange = (value: string) => {
    setCourseName(value);

    setCourseInfo(courseCode, value);
  };

  // Assignment title
  const handleAssignmentTitleChange = (value: string) => {
    setAssignmentTitle(value);

    setAssignmentInfo(value, description);
  };

  // Description
  const handleDescriptionChange = (value: string) => {
    setDescription(value);

    setAssignmentInfo(assignmentTitle, value);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!submission.file) {
      toast.error("Please select a file");
      return;
    }

    if (!selectedLecturerId) {
      toast.error("Please select a lecturer");
      return;
    }

    if (!courseCode || !courseName) {
      toast.error("Please enter course details");
      return;
    }

    if (!assignmentTitle) {
      toast.error("Please enter assignment title");
      return;
    }

    const success = await submitSubmission();

    if (success) {
      toast.success("Submission uploaded successfully");

      setTimeout(() => {
        resetSubmission();

        setCourseCode("");
        setCourseName("");
        setAssignmentTitle("");
        setDescription("");
        setSelectedLecturerId("");

        router.push("/student/submission-success");
      }, 1500);
    }
  };

  const isFormValid =
    !!submission.file &&
    !!selectedLecturerId &&
    !!courseCode &&
    !!courseName &&
    !!assignmentTitle &&
    !isSubmitting &&
    !loadingLecturers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Submit Assignment
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Files are encrypted before upload using AES-256 + RSA encryption
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-2">
          <FileDropzone
            file={submission.file}
            isDragging={isDragging}
            isSubmitting={isSubmitting}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            onFileAccepted={handleFileAccepted}
            onRemoveFile={() => setFile(null)}
            formatFileSize={formatFileSize}
          />

          <AssignmentDetailsForm
            courseCode={courseCode}
            courseName={courseName}
            assignmentTitle={assignmentTitle}
            description={description}
            selectedLecturerId={selectedLecturerId}
            lecturers={lecturers}
            loadingLecturers={loadingLecturers}
            lecturerError={lecturerError}
            isSubmitting={isSubmitting}
            onCourseCodeChange={handleCourseCodeChange}
            onCourseNameChange={handleCourseNameChange}
            onAssignmentTitleChange={handleAssignmentTitleChange}
            onDescriptionChange={handleDescriptionChange}
            onLecturerChange={handleLecturerChange}
          />
        </div>

        {/* RIGHT */}
        <aside className="space-y-4">
          <EncryptionPipeline stage={stage} progress={progress} />

          <SubmissionChecklist
            hasFile={!!submission.file}
            hasLecturer={!!selectedLecturerId}
            hasCourse={!!courseCode && !!courseName}
            hasTitle={!!assignmentTitle}
          />

          <SubmitButton isSubmitting={isSubmitting} disabled={!isFormValid} />
        </aside>
      </form>
    </div>
  );
}
