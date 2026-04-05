import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-500/20 text-brand-300 border border-brand-500/30",
        accent: "bg-accent-500/20 text-accent-300 border border-accent-500/30",
        warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
        destructive: "bg-red-500/20 text-red-300 border border-red-500/30",
        outline: "border border-border text-gray-400",
        muted: "bg-surface-200 text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
