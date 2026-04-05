import * as React from "react";
import { cn } from "../lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizes = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

const textSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

function Logo({ size = "md", showText = true, className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg gradient-brand font-bold text-white shadow-lg shadow-brand-500/30",
          sizes[size]
        )}
      >
        KSC
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight text-white", textSizes[size])}>
          KSC<span className="text-brand-400">SYSTEM</span>
        </span>
      )}
    </div>
  );
}

export { Logo };
