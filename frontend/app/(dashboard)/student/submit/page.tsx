// app/student/submit/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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

  const hasSentCourseInfo = useRef(false);
  const hasSentAssignmentInfo = useRef(false);
  const hasSentLecturer = useRef(false);

  const {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    formatFileSize,
  } = useFileUpload({ maxSizeMB: 50 });

  //  Fetch lecturers
  useEffect(() => {
    if (!token) {
      setLoadingLecturers(false);
      return;
    }
    (async () => {
      try {
        setLoadingLecturers(true);
        setLecturerError(null);
        const res = await usersAPI.getLecturers(token);
        if (res.success && res.lecturers) {
          setLecturers(res.lecturers);
        } else {
          setLecturerError(res.message || "Failed to load lecturers");
          toast.error("Could not load lecturers. Please refresh the page.");
        }
      } catch {
        setLecturerError("Failed to load lecturers");
        toast.error("Failed to load lecturers. Please check your connection.");
      } finally {
        setLoadingLecturers(false);
      }
    })();
  }, [token]);

  // Sync course info to context
  useEffect(() => {
    if (courseCode && courseName && !hasSentCourseInfo.current) {
      setCourseInfo(courseCode, courseName);
      hasSentCourseInfo.current = true;
    } else if ((!courseCode || !courseName) && hasSentCourseInfo.current) {
      hasSentCourseInfo.current = false;
    }
  }, [courseCode, courseName, setCourseInfo]);

  // Sync assignment info to context
  useEffect(() => {
    if (assignmentTitle && !hasSentAssignmentInfo.current) {
      setAssignmentInfo(assignmentTitle, description);
      hasSentAssignmentInfo.current = true;
    }
  }, [assignmentTitle, description, setAssignmentInfo]);

  // Sync lecturer to context
  useEffect(() => {
    if (selectedLecturerId && !hasSentLecturer.current) {
      const lec = lecturers.find((l) => l._id === selectedLecturerId);
      if (lec) {
        setLecturer(lec._id, lec.name);
        hasSentLecturer.current = true;
      }
    } else if (!selectedLecturerId && hasSentLecturer.current) {
      hasSentLecturer.current = false;
    }
  }, [selectedLecturerId, lecturers, setLecturer]);

  //  Handlers
  const handleFileAccepted = (file: File) => {
    setFile(file);
    toast.success(`File "${file.name}" selected successfully`);
  };

  const handleLecturerChange = (value: string) => {
    setSelectedLecturerId(value);
    hasSentLecturer.current = false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission.file) return toast.error("Please select a file to upload");
    if (!selectedLecturerId) return toast.error("Please select a lecturer");
    if (!courseCode || !courseName)
      return toast.error("Please enter course code and name");
    if (!assignmentTitle)
      return toast.error("Please enter an assignment title");

    const success = await submitSubmission();
    if (success) {
      setTimeout(() => {
        router.push("/student/submission-success");
        resetSubmission();
        setCourseCode("");
        setCourseName("");
        setAssignmentTitle("");
        setDescription("");
        setSelectedLecturerId("");
        hasSentCourseInfo.current = false;
        hasSentAssignmentInfo.current = false;
        hasSentLecturer.current = false;
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
        <p className="text-sm text-muted-foreground mt-1">
          Files are encrypted in your browser before upload using AES-256
          encryption
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/*  Left: main form  */}
        <div className="lg:col-span-2 space-y-6">
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
            onCourseCodeChange={(v) => {
              setCourseCode(v);
              hasSentCourseInfo.current = false;
            }}
            onCourseNameChange={(v) => {
              setCourseName(v);
              hasSentCourseInfo.current = false;
            }}
            onAssignmentTitleChange={(v) => {
              setAssignmentTitle(v);
              hasSentAssignmentInfo.current = false;
            }}
            onDescriptionChange={setDescription}
            onLecturerChange={handleLecturerChange}
          />
        </div>

        {/*  Right: sidebar  */}
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
