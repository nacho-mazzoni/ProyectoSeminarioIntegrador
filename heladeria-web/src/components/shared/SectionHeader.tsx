import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-2", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
        {description && <p className="text-base text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
