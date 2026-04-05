import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "gradient-brand text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:brightness-110",
        secondary: "bg-surface-200 text-white hover:bg-surface-300 border border-border",
        outline: "border border-border bg-transparent hover:bg-surface-100 text-white",
        ghost: "hover:bg-surface-100 text-white",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20",
        accent: "gradient-accent text-white shadow-lg shadow-accent-500/20 hover:shadow-accent-500/40 hover:brightness-110",
        link: "text-brand-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
