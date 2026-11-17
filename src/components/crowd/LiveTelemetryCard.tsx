"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DestinationCrowdSummary } from "@/services/crowdQueries";
import { CrowdStatusBadge } from "./CrowdStatusBadge";
import { PredictionForecastWidget } from "./PredictionForecastWidget";
import { CrowdChart } from "./CrowdChart";
import { TurnstileScannerModal } from "./TurnstileScannerModal";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  QrCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";

interface LiveTelemetryCardProps {
  summary: DestinationCrowdSummary;
  onRefreshNeeded?: () => void;
}

export const LiveTelemetryCard: React.FC<LiveTelemetryCardProps> = ({
  summary,
  onRefreshNeeded,
}) => {
  const [showPredictions, setShowPredictions] = useState(true);
  const [showHourlyChart, setShowHourlyChart] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const getTrendBadge = (trend: "rising" | "stable" | "falling") => {
    switch (trend) {
      case "rising":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Rising Flow</span>
          </span>
        );
      case "falling":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Falling Flow</span>
          </span>
        );
      case "stable":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            <Minus className="w-3.5 h-3.5" />
            <span>Stable Flow</span>
          </span>
        );
    }
  };

  const formattedTime = new Date(summary.lastTelemetryAt || Date.now()).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <GlassCard className="p-6 space-y-6 border-slate-200/80 shadow-md">
      {/* Top Banner: Name, Badges, Navigation Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-serif font-bold text-2xl text-slate-900 tracking-tight">
              {summary.name}
            </h3>
            <CrowdStatusBadge
              level={summary.currentCrowdLevel}
              percentage={summary.currentCrowdPercentage}
              size="md"
            />
            {getTrendBadge(summary.crowdTrend)}
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {summary.location} • Monitored under {summary.officialConservationSource}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Test Turnstile Scan</span>
          </button>
          <Link
            href={`/destinations/${summary.slug}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Guide
          </Link>
          <Link
            href={`/tickets?destination=${summary.slug}`}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-amber-700 transition-colors shadow-xs"
          >
            Reserve Slot
          </Link>
        </div>
      </div>

      {/* Primary Mathematical Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Metric 1: Current Visitors */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">Current Visitors</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {summary.currentVisitors.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Inside site perimeter
          </span>
        </div>

        {/* Metric 2: Approved Capacity */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">Max Approved Capacity</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {summary.maxCapacity.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Conservation limit
          </span>
        </div>

        {/* Metric 3: Occupancy */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">Occupancy Rate</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {summary.currentCrowdPercentage}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Threshold: {summary.thresholds.moderate}% Mod / {summary.thresholds.high}% High
          </span>
        </div>

        {/* Metric 4: Queue Waiting Time */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">Entrance Queue Wait</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-amber-700">
            {summary.waitTimeMinutes} mins
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Queue: {summary.queueLength} persons
          </span>
        </div>

        {/* Metric 5: Flow In/Out */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">Gate Flow Rates</span>
          <div className="text-xs font-semibold text-slate-800 space-y-0.5 mt-1">
            <span className="flex items-center gap-1 text-emerald-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {summary.avgEntryRatePerMin} in/min
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {summary.avgExitRatePerMin} out/min
            </span>
          </div>
        </div>

        {/* Metric 6: Telemetry Timestamp */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">Last Telemetry Sync</span>
          <span className="text-sm font-mono font-bold text-slate-900 block mt-1">
            {formattedTime}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Telemetry Stream
          </span>
        </div>
      </div>

      {/* Visual Capacity Gauge with Threshold Ticks */}
      <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/50 border border-slate-200/60">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Monument Carrying Capacity Gauge</span>
          <span>
            {summary.currentVisitors.toLocaleString()} / {summary.maxCapacity.toLocaleString()} visitors ({summary.currentCrowdPercentage}%)
          </span>
        </div>
        <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              summary.currentCrowdPercentage >= summary.thresholds.high
                ? "bg-gradient-to-r from-orange-500 to-rose-600"
                : summary.currentCrowdPercentage >= summary.thresholds.moderate
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
            style={{ width: `${Math.min(100, summary.currentCrowdPercentage)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
          <span>0%</span>
          <span>Low Threshold: {summary.thresholds.low}%</span>
          <span>Moderate Threshold: {summary.thresholds.moderate}%</span>
          <span>High Alert: {summary.thresholds.high}%</span>
          <span>100% Max</span>
        </div>
      </div>

      {/* Short-Term Arrival & Density Predictions Widget */}
      <div className="p-4 rounded-xl bg-amber-50/30 border border-amber-200/60">
        <PredictionForecastWidget
          predictions={summary.predictions}
          config={{
            max_approved_capacity: summary.maxCapacity,
            threshold_low: summary.thresholds.low,
            threshold_moderate: summary.thresholds.moderate,
            threshold_high: summary.thresholds.high,
          }}
        />
      </div>

      {/* Accordion / Toggle for Detailed Diurnal Flow Variation Chart */}
      <div className="pt-1 border-t border-slate-200/70">
        <button
          onClick={() => setShowHourlyChart(!showHourlyChart)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-amber-800 transition-colors py-2"
        >
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>{showHourlyChart ? "Hide" : "View"} Hourly Historical Flow Curves (06:00 AM - 07:30 PM)</span>
          </span>
          {showHourlyChart ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showHourlyChart && (
          <div className="pt-4 animate-in fade-in">
            <CrowdChart
              hourlyTrends={summary.hourlyTrends}
              destinationName={summary.name}
              bestVisitingHours={summary.bestVisitingHours}
              waitTimeMinutes={summary.waitTimeMinutes}
              entryRatePerHour={summary.entryRatePerHour}
            />
          </div>
        )}
      </div>

      {/* Turnstile QR Access Gate Scanner Modal */}
      <TurnstileScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        destinationId={summary.destinationId}
        destinationName={summary.name}
        onScanCompleted={() => {
          if (onRefreshNeeded) onRefreshNeeded();
        }}
      />
    </GlassCard>
  );
};
