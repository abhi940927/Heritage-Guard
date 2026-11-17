"use client";

import React from "react";
import { CrowdPrediction, DestinationCrowdConfig } from "@/types";
import { CrowdStatusBadge } from "./CrowdStatusBadge";
import { TrendingUp, TrendingDown, Minus, Clock, Brain, AlertCircle } from "lucide-react";

interface PredictionForecastWidgetProps {
  predictions: {
    m15: CrowdPrediction;
    m30: CrowdPrediction;
    m60: CrowdPrediction;
  };
  config: {
    max_approved_capacity: number;
    threshold_low: number;
    threshold_moderate: number;
    threshold_high: number;
  };
  compact?: boolean;
}

export const PredictionForecastWidget: React.FC<PredictionForecastWidgetProps> = ({
  predictions,
  config,
  compact = false,
}) => {
  const cards = [
    { label: "+15 Minutes", data: predictions.m15, hint: "Immediate window" },
    { label: "+30 Minutes", data: predictions.m30, hint: "Short-range forecast" },
    { label: "+60 Minutes", data: predictions.m60, hint: "Next hour outlook" },
  ];

  const getTrendIcon = (trend: "rising" | "stable" | "falling") => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="w-3.5 h-3.5 text-rose-600" />;
      case "falling":
        return <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />;
      case "stable":
      default:
        return <Minus className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">
            Short-Term Arrival & Density Predictions
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100/80 text-amber-900 font-semibold">
          DEMO PREDICTIVE ENGINE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card, idx) => {
          const pred = card.data;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-xs hover:border-amber-400/50 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-600" />
                  {card.label}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{card.hint}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                    {pred.expected_visitors.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    expected visitors ({pred.predicted_occupancy_percentage}%)
                  </span>
                </div>
                <CrowdStatusBadge
                  level={pred.expected_crowd_category}
                  size="sm"
                  showDot={false}
                />
              </div>

              {/* Occupancy bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pred.predicted_occupancy_percentage >= config.threshold_high
                      ? "bg-rose-500"
                      : pred.predicted_occupancy_percentage >= config.threshold_moderate
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, pred.predicted_occupancy_percentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  Trend: {getTrendIcon(pred.predicted_crowd_trend)}
                  <strong className="capitalize font-semibold">{pred.predicted_crowd_trend}</strong>
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  +{pred.predicted_entries} / -{pred.predicted_exits}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!compact && (
        <p className="text-[10px] text-slate-500 flex items-center gap-1 italic">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
          <span>
            Expected Visitors = Current Visitors + Predicted Entries - Predicted Exits (based on trailing moving averages).
          </span>
        </p>
      )}
    </div>
  );
};
