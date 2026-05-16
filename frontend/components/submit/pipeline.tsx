import { Check } from "lucide-react";
import { Lock } from "lucide-react";

interface PipelineStepProps {
  label: string;
  icon: typeof Lock;
  active: boolean;
  done: boolean;
}

export function PipelineStep({
  label,
  icon: Icon,
  active,
  done,
}: PipelineStepProps) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <div
        className={`size-8 rounded-md grid place-items-center border transition-all duration-300 ${
          done
            ? "bg-success/15 border-success/40 text-success"
            : active
              ? "bg-primary/15 border-primary/40 text-primary animate-pulse shadow-lg shadow-primary/20"
              : "bg-secondary border-border text-muted-foreground"
        }`}
      >
        {done ? <Check className="size-4" /> : <Icon className="size-4" />}
      </div>
      <span
        className={`transition-colors duration-300 ${
          done || active
            ? "text-foreground font-medium"
            : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </li>
  );
}
