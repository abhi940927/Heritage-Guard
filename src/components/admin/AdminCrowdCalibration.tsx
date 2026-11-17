"use client";

import React, { useState, useEffect } from "react";
import { DestinationCrowdSummary } from "@/services/crowdQueries";
import { CrowdAuditRecord } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import { TurnstileScannerModal } from "@/components/crowd/TurnstileScannerModal";
import {
  Sliders,
  ShieldAlert,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  QrCode,
  CheckCircle2,
  History,
} from "lucide-react";

export const AdminCrowdCalibration: React.FC = () => {
  const [summaries, setSummaries] = useState<DestinationCrowdSummary[]>([]);
  const [auditLogs, setAuditLogs] = useState<CrowdAuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonument, setSelectedMonument] = useState<DestinationCrowdSummary | null>(null);
  const [scannerMonument, setScannerMonument] = useState<DestinationCrowdSummary | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Calibration Form State
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [maxCapacity, setMaxCapacity] = useState<number>(0);
  const [queueLength, setQueueLength] = useState<number>(0);
  const [trend, setTrend] = useState<"rising" | "stable" | "falling">("stable");
  const [thresholdLow, setThresholdLow] = useState<number>(30);
  const [thresholdMod, setThresholdMod] = useState<number>(60);
  const [thresholdHigh, setThresholdHigh] = useState<number>(85);
  const [actorEmail, setActorEmail] = useState<string>("admin@heritageguard.gov.in");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTele, resAudit] = await Promise.all([
        fetch("/api/crowd"),
        fetch("/api/crowd/calibrate"),
      ]);

      if (resTele.ok) {
        const data = await resTele.json();
        setSummaries(data.data || []);
      }

      if (resAudit.ok) {
        const auditData = await resAudit.json();
        setAuditLogs(auditData.data || []);
      }
    } catch (err) {
      console.error("Failed to load calibration data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCalibration = (summary: DestinationCrowdSummary) => {
    setSelectedMonument(summary);
    setVisitorCount(summary.currentVisitors);
    setMaxCapacity(summary.maxCapacity);
    setQueueLength(summary.queueLength);
    setTrend(summary.crowdTrend);
    setThresholdLow(summary.thresholds.low);
    setThresholdMod(summary.thresholds.moderate);
    setThresholdHigh(summary.thresholds.high);
    setActionSuccess(null);
  };

  const handleCalibrateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonument) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/crowd/calibrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_id: selectedMonument.destinationId,
          visitor_count: visitorCount,
          max_capacity: maxCapacity,
          queue_length: queueLength,
          trend,
          thresholds: {
            low: thresholdLow,
            moderate: thresholdMod,
            high: thresholdHigh,
          },
          actor_email: actorEmail,
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        setActionSuccess(resData.message || "Crowd telemetry successfully updated and audited.");
        await fetchData();
        setTimeout(() => {
          setSelectedMonument(null);
          setActionSuccess(null);
        }, 1500);
      } else {
        const err = await res.json();
        alert(`Calibration error: ${err.error || "Failed to update."}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error updating crowd telemetry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Smart Crowd Telemetry & Gate Calibration
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              ASI Carrying Capacity Standard
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time headcount overrides, carrying capacity adjustments, queue wait-time service rates, and audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          {summaries.length > 0 && (
            <Button
              onClick={() => setScannerMonument(summaries[0])}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              <QrCode className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Turnstile Gate Simulator
            </Button>
          )}
          <Button
            onClick={fetchData}
            variant="ghost"
            size="sm"
            disabled={loading}
            className="text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Telemetry Grid */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/90 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Monument / Sanctuary</th>
                <th className="py-3 px-4">Current Headcount</th>
                <th className="py-3 px-4">Carrying Capacity</th>
                <th className="py-3 px-4">Occupancy</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Queue Wait</th>
                <th className="py-3 px-4">Flow Trend</th>
                <th className="py-3 px-4 text-right">Gate Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summaries.map((summary) => {
                const occupancy = summary.currentCrowdPercentage;
                return (
                  <tr key={summary.destinationId} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{summary.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span>{summary.location}, {summary.state}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {summary.currentVisitors.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {summary.maxCapacity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              occupancy >= 85
                                ? "bg-rose-600"
                                : occupancy >= 60
                                ? "bg-amber-500"
                                : occupancy >= 30
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, occupancy)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-700">
                          {occupancy.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <CrowdStatusBadge
                        level={summary.currentCrowdLevel}
                        percentage={summary.currentCrowdPercentage}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {summary.waitTimeMinutes} min
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold capitalize ${
                          summary.crowdTrend === "rising"
                            ? "text-rose-700"
                            : summary.crowdTrend === "falling"
                            ? "text-emerald-700"
                            : "text-slate-600"
                        }`}
                      >
                        {summary.crowdTrend === "rising" ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : summary.crowdTrend === "falling" ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                        {summary.crowdTrend}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setScannerMonument(summary)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                        title="Simulate Turnstile Gate Scans"
                      >
                        <QrCode className="w-3 h-3 text-slate-600" />
                        Scan
                      </button>
                      <button
                        onClick={() => openCalibration(summary)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100/80 text-amber-900 hover:bg-amber-200/90 border border-amber-300 transition-colors inline-flex items-center gap-1"
                        title="Calibrate Crowd Metrics"
                      >
                        <Sliders className="w-3 h-3 text-amber-700" />
                        Calibrate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Calibration Modal */}
      {selectedMonument && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-amber-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-serif font-bold text-lg text-slate-900">
                  Monument Headcount & Telemetry Calibration
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedMonument.name} &bull; Official ID: {selectedMonument.destinationId.slice(0, 8)}...
                </p>
              </div>
              <button
                onClick={() => setSelectedMonument(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCalibrateSubmit} className="space-y-4 text-xs">
              {/* Formula explanation note */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Carrying Capacity Mathematical Formulation
                </div>
                <div className="font-mono text-[11px] text-slate-700">
                  Occupancy % = (Current Visitors / Max Approved Capacity) &times; 100
                </div>
                <div className="text-[10px] text-slate-500">
                  Entrance Waiting Time = Queue Length &divide; Turnstile Processing Rate ({selectedMonument.avgEntryRatePerMin ? Math.round(selectedMonument.avgEntryRatePerMin * 1.5) : 30}/min)
                </div>
              </div>

              {/* Headcount Override */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Current Visitors (Headcount)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={visitorCount}
                    onChange={(e) => setVisitorCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Reconciled gate physical count</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Max Approved Capacity
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Math.max(100, parseInt(e.target.value) || 100))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                    required
                  />
                  <span className="text-[10px] text-slate-400">ASI approved ecological limit</span>
                </div>
              </div>

              {/* Real-time calculated preview */}
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-600">Calculated Occupancy: </span>
                  <span className="font-mono font-bold text-slate-900">
                    {maxCapacity > 0 ? ((visitorCount / maxCapacity) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Projected Classification: </span>
                  <span className="font-bold text-amber-900">
                    {(() => {
                      const occ = maxCapacity > 0 ? (visitorCount / maxCapacity) * 100 : 0;
                      if (occ < thresholdLow) return "Low Crowd";
                      if (occ < thresholdMod) return "Moderate Crowd";
                      if (occ < thresholdHigh) return "High Crowd";
                      return "Very High Crowd";
                    })()}
                  </span>
                </div>
              </div>

              {/* Queue Length & Flow Trend */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Queue Length (Visitors waiting)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={queueLength}
                    onChange={(e) => setQueueLength(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">
                    Est. wait: {Math.ceil(queueLength / 30)} mins
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Crowd Flow Direction
                  </label>
                  <select
                    value={trend}
                    onChange={(e) => setTrend(e.target.value as "rising" | "stable" | "falling")}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="rising">Rising (Surge incoming)</option>
                    <option value="stable">Stable (Balanced flow)</option>
                    <option value="falling">Falling (Diverging exit)</option>
                  </select>
                </div>
              </div>

              {/* Configurable Thresholds */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Monument Specific Classification Thresholds (%)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Low Max %</span>
                    <input
                      type="number"
                      min={10}
                      max={50}
                      value={thresholdLow}
                      onChange={(e) => setThresholdLow(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Moderate Max %</span>
                    <input
                      type="number"
                      min={30}
                      max={75}
                      value={thresholdMod}
                      onChange={(e) => setThresholdMod(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">High Max %</span>
                    <input
                      type="number"
                      min={60}
                      max={95}
                      value={thresholdHigh}
                      onChange={(e) => setThresholdHigh(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Audit actor */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Officer Email (Recorded in Immutable Audit Log)
                </label>
                <input
                  type="email"
                  value={actorEmail}
                  onChange={(e) => setActorEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMonument(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                >
                  {submitting ? "Applying & Auditing..." : "Save Calibration"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Trail Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-700" />
          <h4 className="font-serif font-bold text-base text-slate-900">
            Immutable Crowd Telemetry Audit Trail
          </h4>
          <span className="text-xs text-slate-500">
            (Tracks administrative overrides, capacity re-baselines, and gate calibrations)
          </span>
        </div>

        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/90 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Officer</th>
                  <th className="py-2.5 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-xs text-slate-400">
                      No administrative calibrations recorded in current operational cycle.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                          {log.action_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {log.actor_email}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Turnstile Scanner Modal */}
      {scannerMonument && (
        <TurnstileScannerModal
          isOpen={Boolean(scannerMonument)}
          onClose={() => {
            setScannerMonument(null);
            fetchData();
          }}
          destinationId={scannerMonument.destinationId}
          destinationName={scannerMonument.name}
          onScanCompleted={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
};
