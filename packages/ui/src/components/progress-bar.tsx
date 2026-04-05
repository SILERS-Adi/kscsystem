import * as React from "react";
import { cn } from "../lib/utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: "brand" | "accent" | "warning" | "destructive";
}

const barVariants = {
  brand: "bg-gradient-to-r from-brand-500 to-brand-400",
  accent: "bg-gradient-to-r from-accent-500 to-accent-400",
  warning: "bg-gradient-to-r from-amber-500 to-amber-400",
  destructive: "bg-gradient-to-r from-red-500 to-red-400",
};

function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  variant = "brand",
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div className="flex-1 h-2 rounded-full bg-surface-300 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barVariants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-400 tabular-nums min-w-[3ch] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
}

export { ProgressBar };
