"use client";

import React from "react";
import { CrowdLevel } from "@/types";
import { Clock, TrendingUp, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface HourlyPoint {
  hour: string;
  expectedLevel: CrowdLevel;
  percentage: number;
}

interface CrowdChartProps {
  hourlyTrends: HourlyPoint[];
  destinationName: string;
  bestVisitingHours: string;
  waitTimeMinutes: number;
  entryRatePerHour: number;
}

export const CrowdChart: React.FC<CrowdChartProps> = ({
  hourlyTrends,
  destinationName,
  bestVisitingHours,
  waitTimeMinutes,
  entryRatePerHour,
}) => {
  const getBarColor = (level: CrowdLevel) => {
    switch (level) {
      case "Low":
        return "bg-emerald-500 hover:bg-emerald-400";
      case "Moderate":
        return "bg-amber-500 hover:bg-amber-400";
      case "High":
        return "bg-orange-500 hover:bg-orange-400";
      case "Very High":
        return "bg-rose-500 hover:bg-rose-400";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <GlassCard className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-slate-900">
            Hourly Density Forecast
          </h3>
          <p className="text-xs text-slate-500">
            Expected visitor occupancy profile for {destinationName} throughout operating hours
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (&lt;40%)
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate
          </span>
          <span className="flex items-center gap-1 text-rose-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High (&gt;75%)
          </span>
        </div>
      </div>

      {/* Hourly Bars Visualizer */}
      <div className="pt-6 pb-2">
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200">
          {hourlyTrends.map((pt, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group relative"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-20 shadow-md">
                {pt.hour}: {pt.percentage}% ({pt.expectedLevel})
              </div>

              {/* Bar */}
              <div
                className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${getBarColor(
                  pt.expectedLevel
                )}`}
                style={{ height: `${Math.max(12, pt.percentage)}%` }}
              />

              <span className="text-[10px] font-medium text-slate-600 mt-2 truncate max-w-full">
                {pt.hour.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Recommended Hours</span>
          </div>
          <p className="text-xs font-semibold text-slate-900 leading-snug">
            {bestVisitingHours}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Est. Queue Wait Time</span>
          </div>
          <p className="text-base font-bold text-slate-900">
            {waitTimeMinutes} mins
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Current Flow Velocity</span>
          </div>
          <p className="text-base font-bold text-slate-900">
            ~{entryRatePerHour} visitors/hr
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
