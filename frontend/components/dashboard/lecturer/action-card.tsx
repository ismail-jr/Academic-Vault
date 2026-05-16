// components/dashboard/lecturer/action-card.tsx
"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color?: "primary" | "blue" | "purple";
  disabled?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  primary: "hover:border-primary/50 group-hover:bg-primary/5",
  blue: "hover:border-blue-500/50 group-hover:bg-blue-500/5",
  purple: "hover:border-purple-500/50 group-hover:bg-purple-500/5",
};

const iconColors = {
  primary: "text-primary",
  blue: "text-blue-500",
  purple: "text-purple-500",
};

export function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  color = "primary",
  disabled = false,
  onClick,
}: ActionCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || onClick) {
      e.preventDefault();
      e.stopPropagation();
      if (onClick) onClick();
    }
  };

  // If disabled, render div instead of Link
  if (disabled) {
    return (
      <div onClick={handleClick}>
        <Card
          className={cn(
            "rounded-2xl p-5 border border-primary/20 transition-all duration-300 cursor-pointer group",
            colorClasses[color],
          )}
        >
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                iconColors[color],
              )}
            >
              <Icon className="size-5" />
            </div>
            <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-mono font-semibold text-sm mt-2">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </Card>
      </div>
    );
  }

  return (
    <Link href={href} onClick={handleClick}>
      <Card
        className={cn(
          "rounded-2xl p-5 border border-primary/20 transition-all duration-300 cursor-pointer group",
          colorClasses[color],
        )}
      >
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
              iconColors[color],
            )}
          >
            <Icon className="size-5" />
          </div>
          <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="font-mono font-semibold text-sm mt-2">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </Card>
    </Link>
  );
}
