import * as React from "react";
import { cn } from "../lib/utils";
import { Card } from "./card";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

function StatCard({ label, value, change, changeLabel, icon, className, ...props }: StatCardProps) {
  return (
    <Card className={cn("p-6", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-xs font-medium",
                  change >= 0 ? "text-accent-400" : "text-red-400"
                )}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
              {changeLabel && <span className="text-xs text-gray-500">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export { StatCard };
