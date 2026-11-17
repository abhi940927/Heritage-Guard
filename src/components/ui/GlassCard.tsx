import React from "react";
import { cn } from "@/lib/utils/cn";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark" | "gold";
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = "light",
  hoverEffect = false,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    light:
      "bg-white/75 backdrop-blur-md border border-amber-900/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
    dark:
      "bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white shadow-[0_12px_40px_rgb(0,0,0,0.25)]",
    gold:
      "bg-gradient-to-br from-amber-50/90 to-amber-100/60 backdrop-blur-md border border-amber-300/60 shadow-[0_8px_30px_rgba(212,175,55,0.12)]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variantStyles[variant],
        hoverEffect &&
          "hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] hover:border-amber-400/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
