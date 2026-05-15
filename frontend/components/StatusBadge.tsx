import { Lock, ShieldCheck, KeyRound, Eye, FileCheck2, CircleAlert } from "lucide-react";

type Status = "Encrypted" | "Decrypted" | "Viewed" | "Pending" | "Reviewed";

const styles: Record<Status, string> = {
  Encrypted: "border-primary/40 bg-primary/10 text-primary",
  Decrypted: "border-warning/40 bg-[oklch(0.78_0.15_75/0.12)] text-[var(--warning)]",
  Viewed: "border-accent/40 bg-accent/10 text-accent",
  Pending: "border-border bg-muted text-muted-foreground",
  Reviewed: "border-accent/40 bg-accent/10 text-accent",
};

const icons: Record<Status, typeof Lock> = {
  Encrypted: Lock,
  Decrypted: KeyRound,
  Viewed: Eye,
  Pending: CircleAlert,
  Reviewed: FileCheck2,
};

export function StatusBadge({ status }: { status: Status }) {
  const Icon = icons[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles[status]}`}
    >
      <Icon className="size-3" />
      {status}
    </span>
  );
}

export function SecurityChip({
  label,
  variant = "primary",
}: {
  label: string;
  variant?: "primary" | "accent";
}) {
  const cls =
    variant === "accent"
      ? "border-accent/40 bg-accent/10 text-accent"
      : "border-primary/40 bg-primary/10 text-primary";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}
    >
      <ShieldCheck className="size-3" />
      {label}
    </span>
  );
}
