import React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5",
      md: "px-4 py-2.5 text-sm font-semibold rounded-xl gap-2",
      lg: "px-6 py-3.5 text-base font-semibold rounded-2xl gap-2.5",
    };

    const variantClasses = {
      primary:
        "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-700/20 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] border border-amber-500/30",
      secondary:
        "bg-slate-900 text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] border border-slate-700/40",
      outline:
        "bg-white/60 backdrop-blur-sm text-slate-800 border border-slate-300/80 hover:bg-amber-50/70 hover:border-amber-400 active:scale-[0.98]",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100/70 active:scale-[0.98]",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
