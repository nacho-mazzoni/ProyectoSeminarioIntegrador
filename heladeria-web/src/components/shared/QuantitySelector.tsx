import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Cantidad",
}: QuantitySelectorProps) {
  const btn = size === "sm" ? "size-8" : "size-10";
  const box = size === "sm" ? "w-8 text-sm" : "w-10 text-base";

  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-card p-1"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "grid place-items-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40",
          btn,
        )}
      >
        <Minus className="size-4" />
      </button>
      <span className={cn("text-center font-semibold tabular-nums", box)} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "grid place-items-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40",
          btn,
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
