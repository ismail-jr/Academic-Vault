import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubmissionChecklistProps {
  hasFile: boolean;
  hasLecturer: boolean;
  hasCourse: boolean;
  hasTitle: boolean;
}

export function SubmissionChecklist({
  hasFile,
  hasLecturer,
  hasCourse,
  hasTitle,
}: SubmissionChecklistProps) {
  const items = [
    { label: "File", done: hasFile },
    { label: "Lecturer", done: hasLecturer },
    { label: "Course", done: hasCourse },
    { label: "Title", done: hasTitle },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {items.map(({ label, done }) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{label}</span>
              <Badge variant={done ? "default" : "secondary"}>
                {done
                  ? label === "File"
                    ? "Selected"
                    : label === "Lecturer"
                      ? "Selected"
                      : "Complete"
                  : label === "File"
                    ? "Not selected"
                    : label === "Lecturer"
                      ? "Not selected"
                      : "Incomplete"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
