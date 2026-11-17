import React from "react";
import { CrowdLevel } from "@/types";
import { getCrowdBadgeStyles } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

interface CrowdStatusBadgeProps {
  level: CrowdLevel;
  percentage?: number;
  showDot?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CrowdStatusBadge: React.FC<CrowdStatusBadgeProps> = ({
  level,
  percentage,
  showDot = true,
  className,
  size = "md",
}) => {
  const styles = getCrowdBadgeStyles(level);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium gap-1.5",
    md: "px-3 py-1 text-xs font-semibold gap-2",
    lg: "px-4 py-1.5 text-sm font-semibold gap-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border backdrop-blur-md transition-colors",
        styles.bg,
        styles.border,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              styles.dot
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              styles.dot
            )}
          />
        </span>
      )}
      <span>{styles.label}</span>
      {typeof percentage === "number" && (
        <span className="opacity-75 font-normal">({percentage}%)</span>
      )}
    </span>
  );
};
