"use client";

import React, { useState } from "react";
import {
  QrCode,
  CheckCircle2,
  AlertOctagon,
  ArrowRightCircle,
  ArrowLeftCircle,
  X,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface TurnstileScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationId: string;
  destinationName: string;
  onScanCompleted: () => void;
}

export const TurnstileScannerModal: React.FC<TurnstileScannerModalProps> = ({
  isOpen,
  onClose,
  destinationId,
  destinationName,
  onScanCompleted,
}) => {
  const [ticketRef, setTicketRef] = useState(`HG-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [scanType, setScanType] = useState<"entry" | "exit">("entry");
  const [gateId, setGateId] = useState("GATE-NORTH-TURNSTILE-01");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    success: boolean;
    text: string;
    code?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResultMessage(null);

    try {
      const res = await fetch("/api/crowd/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_id: destinationId,
          ticket_reference: ticketRef,
          scan_type: scanType,
          gate_id: gateId,
          scanner_device_id: "OPTICAL-SCANNER-DESK-01",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResultMessage({
          success: false,
          text: data.error || "Turnstile scan failed.",
          code: data.rejectionCode,
        });
      } else {
        setResultMessage({
          success: true,
          text: data.message || "Scan validated successfully.",
        });
        onScanCompleted();
      }
    } catch (err) {
      setResultMessage({
        success: false,
        text: "Network or communication error with turnstile service.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateNewTicket = () => {
    setTicketRef(`HG-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    setResultMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-300">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Turnstile Access Gate Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Testing live entry / exit scan telemetry for <strong>{destinationName}</strong>
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setScanType("entry");
              setResultMessage(null);
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              scanType === "entry"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowRightCircle className="w-4 h-4" />
            <span>Visitor Entry Scan</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setScanType("exit");
              setResultMessage(null);
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              scanType === "exit"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowLeftCircle className="w-4 h-4" />
            <span>Visitor Exit Scan</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Ticket Reference Number
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={ticketRef}
                onChange={(e) => setTicketRef(e.target.value.toUpperCase())}
                placeholder="HG-2026-XXXXX"
                className="w-full px-3 py-2 font-mono text-sm uppercase rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <button
                type="button"
                onClick={generateNewTicket}
                title="Generate new ticket"
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Test duplicate prevention by scanning the same ticket twice for Entry.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Access Gate Location
            </label>
            <select
              value={gateId}
              onChange={(e) => setGateId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
            >
              <option value="GATE-NORTH-TURNSTILE-01">North Turnstile Gate (Main)</option>
              <option value="GATE-EAST-EXPRESS-02">East Express Turnstile Gate</option>
              <option value="GATE-SOUTH-EXIT-03">South Exit Turnstile</option>
              <option value="GATE-WEST-ACCESSIBLE-04">West Accessible Barrier Gate</option>
            </select>
          </div>

          {resultMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                resultMessage.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
            >
              {resultMessage.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-semibold block">
                  {resultMessage.success ? "Scan Verified & Processed" : "Scan Rejected"}
                </span>
                <p className="leading-relaxed">{resultMessage.text}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                scanType === "entry"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Execute {scanType === "entry" ? "Entry" : "Exit"} Scan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
