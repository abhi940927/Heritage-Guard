import { CrowdLevel } from "@/types";

export function formatCurrency(amount: number): string {
  if (amount === 0) return "Free Entry";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTime(timeString: string): string {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHours}:${minutes} ${ampm}`;
}

export function getCrowdBadgeStyles(level: CrowdLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
} {
  switch (level) {
    case "Low":
      return {
        bg: "bg-emerald-50 text-emerald-800",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        label: "Low Crowd",
      };
    case "Moderate":
      return {
        bg: "bg-amber-50 text-amber-800",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        label: "Moderate Crowd",
      };
    case "High":
      return {
        bg: "bg-orange-50 text-orange-800",
        text: "text-orange-700",
        border: "border-orange-200",
        dot: "bg-orange-500",
        label: "High Crowd",
      };
    case "Very High":
      return {
        bg: "bg-rose-50 text-rose-800",
        text: "text-rose-700",
        border: "border-rose-200",
        dot: "bg-rose-500",
        label: "Very High Crowd",
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-800",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-500",
        label: "Normal",
      };
  }
}
