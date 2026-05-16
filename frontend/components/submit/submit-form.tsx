import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lecturer } from "@/lib/api/users";

interface AssignmentDetailsFormProps {
  courseCode: string;
  courseName: string;
  assignmentTitle: string;
  description: string;
  selectedLecturerId: string;
  lecturers: Lecturer[];
  loadingLecturers: boolean;
  lecturerError: string | null;
  isSubmitting: boolean;
  onCourseCodeChange: (value: string) => void;
  onCourseNameChange: (value: string) => void;
  onAssignmentTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLecturerChange: (value: string) => void;
}

export function AssignmentDetailsForm({
  courseCode,
  courseName,
  assignmentTitle,
  description,
  selectedLecturerId,
  lecturers,
  loadingLecturers,
  lecturerError,
  isSubmitting,
  onCourseCodeChange,
  onCourseNameChange,
  onAssignmentTitleChange,
  onDescriptionChange,
  onLecturerChange,
}: AssignmentDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Assignment Details
        </CardTitle>
        <CardDescription>
          Provide information about your submission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lecturer" className="text-xs font-semibold">
              Lecturer <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedLecturerId}
              onValueChange={onLecturerChange}
              disabled={isSubmitting || loadingLecturers}
            >
              <SelectTrigger id="lecturer" className="rounded-lg">
                <SelectValue
                  placeholder={
                    loadingLecturers
                      ? "Loading lecturers..."
                      : "Select lecturer"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((lecturer) => (
                  <SelectItem key={lecturer._id} value={lecturer._id}>
                    <div className="flex flex-col">
                      <span>{lecturer.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {lecturer.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {lecturerError && (
              <p className="text-xs text-destructive mt-1">{lecturerError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignmentTitle" className="text-xs font-semibold">
              Assignment Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assignmentTitle"
              value={assignmentTitle}
              onChange={(e) => onAssignmentTitleChange(e.target.value)}
              placeholder="e.g., Machine Learning Assignment 1"
              className="rounded-lg"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="courseCode" className="text-xs font-semibold">
              Course Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="courseCode"
              value={courseCode}
              onChange={(e) => onCourseCodeChange(e.target.value.toUpperCase())}
              placeholder="e.g., CS401"
              className="rounded-lg font-mono"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseName" className="text-xs font-semibold">
              Course Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="courseName"
              value={courseName}
              onChange={(e) => onCourseNameChange(e.target.value)}
              placeholder="e.g., Machine Learning"
              className="rounded-lg"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Any additional notes for the lecturer..."
            className="rounded-lg resize-none"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
    </Card>
  );
}
