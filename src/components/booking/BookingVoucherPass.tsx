"use client";

import React, { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import { Booking } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { TurnstileScannerModal } from "@/components/crowd/TurnstileScannerModal";
import {
  CheckCircle2,
  QrCode,
  RefreshCw,
  Download,
  Share2,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Users,
  Building2,
  Mail,
  Printer,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Timer,
  Lock,
} from "lucide-react";

interface BookingVoucherPassProps {
  booking: Booking;
  onBookAnother: () => void;
}

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export const BookingVoucherPass: React.FC<BookingVoucherPassProps> = ({
  booking,
  onBookAnother,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrToken, setQrToken] = useState<string>(
    () => `${booking.booking_reference}-${Date.now().toString(36).toUpperCase()}`
  );

  // 3-Hour QR Expiration State
  const initialIssuedMs = useMemo(() => {
    if (booking.qr_issued_at) {
      return new Date(booking.qr_issued_at).getTime();
    }
    return Date.now();
  }, [booking.qr_issued_at]);

  const [issuedTimestampMs, setIssuedTimestampMs] = useState<number>(initialIssuedMs);
  const [expiresTimestampMs, setExpiresTimestampMs] = useState<number>(
    initialIssuedMs + THREE_HOURS_MS
  );
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    Math.max(0, Math.floor((initialIssuedMs + THREE_HOURS_MS - Date.now()) / 1000))
  );
  const [isExpired, setIsExpired] = useState<boolean>(() =>
    Date.now() >= initialIssuedMs + THREE_HOURS_MS
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  // Live 1-second countdown ticker for 3-hour expiration
  useEffect(() => {
    const updateTicker = () => {
      const now = Date.now();
      const diffMs = expiresTimestampMs - now;
      if (diffMs <= 0) {
        setRemainingSeconds(0);
        setIsExpired(true);
      } else {
        setRemainingSeconds(Math.floor(diffMs / 1000));
        setIsExpired(false);
      }
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, [expiresTimestampMs]);

  // Format remaining time nicely
  const formatCountdown = (totalSecs: number) => {
    if (totalSecs <= 0) return "00h 00m 00s (Expired)";
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const formattedExpiryTime = useMemo(() => {
    return new Date(expiresTimestampMs).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [expiresTimestampMs]);

  const formattedIssuedTime = useMemo(() => {
    return new Date(issuedTimestampMs).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [issuedTimestampMs]);

  // Function to generate high-resolution dynamic QR Code
  const generateQRCode = async (
    currentToken: string,
    issuedMs: number,
    expiresMs: number
  ) => {
    try {
      setIsGenerating(true);
      // Construct official ticket validation payload with strict 3-hour expiration
      const qrPayload = JSON.stringify({
        ref: booking.booking_reference,
        token: currentToken,
        monument: booking.destination_name,
        date: booking.visit_date,
        slot: booking.slot_label,
        lead: booking.visitor_lead_name,
        count: booking.total_visitors,
        issued_at: new Date(issuedMs).toISOString(),
        expires_at: new Date(expiresMs).toISOString(),
        validity_window: "3 Hours",
        verifiedBy: "ASI_TURNSTILE_INFORMATICS_DIRECTORATE",
      });

      const url = await QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: isExpired ? "#475569" : "#0F172A", // Slate if expired, Deep Slate otherwise
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      });

      setQrDataUrl(url);
    } catch (err) {
      console.error("Failed to generate QR Code:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate on initial render and when token or timestamps change
  useEffect(() => {
    generateQRCode(qrToken, issuedTimestampMs, expiresTimestampMs);
  }, [booking.booking_reference, qrToken, issuedTimestampMs, expiresTimestampMs]);

  // Handle dynamic QR Code regeneration (resets 3-hour validity timer)
  const handleRegenerateQR = async () => {
    const now = Date.now();
    const newExpires = now + THREE_HOURS_MS;
    const newToken = `${booking.booking_reference}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${now.toString(36).toUpperCase()}`;

    // Sync with backend turnstile registry
    try {
      await fetch("/api/crowd/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "refresh",
          ticket_reference: booking.booking_reference,
          qr_issued_timestamp_ms: now,
        }),
      });
    } catch (e) {
      console.warn("Failed to sync ticket refresh with server:", e);
    }

    setQrToken(newToken);
    setIssuedTimestampMs(now);
    setExpiresTimestampMs(newExpires);
    setRemainingSeconds(Math.floor(THREE_HOURS_MS / 1000));
    setIsExpired(false);
    generateQRCode(newToken, now, newExpires);

    setScanNotice("✅ Fresh 3-Hour Gate Pass Generated & Validated!");
    setTimeout(() => setScanNotice(null), 4000);
  };

  // Download QR Code image
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `HeritageGuard-${booking.booking_reference}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GlassCard className="max-w-2xl mx-auto p-6 sm:p-8 space-y-6 border-2 border-amber-400 bg-white/95 shadow-2xl rounded-3xl relative overflow-hidden">
      {/* Decorative Passport Stamp Watermark */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-4 border-amber-500/10 pointer-events-none flex items-center justify-center rotate-12">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-900/15 text-center">
          Archaeological Survey of India &bull; Turnstile Pass
        </span>
      </div>

      {/* Confirmation Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md shadow-emerald-600/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Booking Confirmed &amp; Dynamic QR Code Issued</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Heritage Entry Reservation Pass
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Official visiting slot confirmed for{" "}
          <strong className="text-slate-900">{booking.destination_name}</strong>
        </p>
      </div>

      {/* Notice Banner if regenerated */}
      {scanNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{scanNotice}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CENTRAL DYNAMIC QR CODE DISPLAY BOX                                   */}
      {/* ==================================================================== */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/50 border-2 border-dashed border-amber-300 space-y-5 text-center shadow-inner">
        {/* Reference Number & Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              Booking Reference No.
            </span>
            <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-wider">
              {booking.booking_reference}
            </span>
          </div>

          {/* Real-time Status Badge */}
          <div className="flex items-center gap-2">
            {isExpired ? (
              <span className="px-3 py-1.5 text-xs font-mono font-bold rounded-xl bg-rose-600 text-white shadow-sm flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-200" />
                QR Code Expired
              </span>
            ) : remainingSeconds < 1800 ? (
              <span className="px-3 py-1.5 text-xs font-mono font-bold rounded-xl bg-amber-500 text-white shadow-sm flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-100" />
                Expiring Soon
              </span>
            ) : (
              <span className="px-3 py-1.5 text-xs font-mono font-bold rounded-xl bg-emerald-600 text-white shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping" />
                Valid for Entry (3h)
              </span>
            )}
          </div>
        </div>

        {/* 3-Hour Expiration Live Countdown Box */}
        <div
          className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 transition-all ${
            isExpired
              ? "bg-rose-50 border-rose-300 text-rose-900"
              : remainingSeconds < 1800
              ? "bg-amber-100 border-amber-400 text-amber-950"
              : "bg-emerald-50 border-emerald-300 text-emerald-950"
          }`}
        >
          <div className="flex items-center gap-2 text-left">
            <Timer
              className={`w-4 h-4 shrink-0 ${
                isExpired
                  ? "text-rose-600"
                  : remainingSeconds < 1800
                  ? "text-amber-700 animate-spin"
                  : "text-emerald-700"
              }`}
            />
            <div>
              <span className="font-bold block">
                {isExpired ? "3-Hour QR Code Validity Expired" : "Strict 3-Hour QR Gate Validity Window"}
              </span>
              <span className="text-[11px] opacity-85">
                {isExpired
                  ? `Expired at ${formattedExpiryTime}. Turnstiles will reject this pass.`
                  : `Issued: ${formattedIssuedTime} • Valid until: ${formattedExpiryTime}`}
              </span>
            </div>
          </div>

          <div className="font-mono font-black text-sm px-3 py-1 rounded-xl bg-white shadow-xs border border-black/5 whitespace-nowrap">
            {isExpired ? "00:00:00 EXPIRED" : `⏱️ ${formatCountdown(remainingSeconds)}`}
          </div>
        </div>

        {/* Dynamic QR Code Canvas with Expired Overlay */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <div className="relative p-3 bg-white rounded-2xl shadow-xl border border-slate-200 group">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`Turnstile Entry QR Code for ${booking.booking_reference}`}
                className={`w-52 h-52 sm:w-60 sm:h-60 rounded-xl object-contain transition-all ${
                  isExpired ? "grayscale opacity-25 filter blur-[1px]" : ""
                }`}
              />
            ) : (
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl flex items-center justify-center bg-slate-100 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
              </div>
            )}

            {/* Corner Markers */}
            <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-amber-600 rounded-tl" />
            <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-amber-600 rounded-tr" />
            <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-amber-600 rounded-bl" />
            <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-amber-600 rounded-br" />

            {/* Expired Watermark Overlay */}
            {isExpired && (
              <div className="absolute inset-0 m-3 rounded-xl bg-slate-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center space-y-2 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-rose-600/90 flex items-center justify-center text-white shadow-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono font-black text-sm tracking-widest text-rose-300 uppercase block">
                    QR PASS EXPIRED
                  </span>
                  <span className="text-[11px] text-slate-200 block max-w-[190px]">
                    Valid for 3 hours only. Turnstile gate entry is currently locked.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRegenerateQR}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Renew for 3h</span>
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Token Details */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-semibold text-slate-700">
              <span
                className={`w-2 h-2 rounded-full ${
                  isExpired ? "bg-rose-500" : "bg-emerald-500"
                }`}
              />
              <span>Token: {qrToken.slice(0, 18)}...</span>
              <span className="text-slate-400">&bull;</span>
              <span>Validity: 3 Hours</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Present this scannable digital voucher at the turnstile gate scanner. QR expires strictly after 3 hours to prevent unauthorized reuse.
            </p>
          </div>

          {/* Dynamic Actions for the QR code */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleRegenerateQR}
              disabled={isGenerating}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                isExpired
                  ? "bg-amber-600 text-white hover:bg-amber-700 ring-2 ring-amber-400 animate-bounce"
                  : "bg-white border border-amber-300 hover:bg-amber-50 text-amber-900"
              }`}
              title="Generate a brand new dynamic QR code with fresh 3-hour security window"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isExpired ? "text-white" : "text-amber-600"
                } ${isGenerating ? "animate-spin" : ""}`}
              />
              <span>{isExpired ? "Regenerate Fresh 3-Hour Gate Pass" : "Generate New QR Code"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              disabled={isExpired}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Save QR Image</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-200" />
              <span>Test Turnstile Scan</span>
            </button>
          </div>
        </div>

        {/* Voucher Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left pt-4 border-t border-amber-200/80 text-xs">
          <div className="p-2.5 rounded-xl bg-white/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Date of Visit
            </span>
            <span className="font-semibold text-slate-900 text-xs">
              {formatDate(booking.visit_date)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Time Slot
            </span>
            <span className="font-semibold text-slate-900 text-xs">
              {booking.slot_label}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Lead Visitor
            </span>
            <span className="font-semibold text-slate-900 text-xs truncate block">
              {booking.visitor_lead_name}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Total Visitors
            </span>
            <span className="font-semibold text-slate-900 text-xs">
              {booking.total_visitors} Person(s)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Contact Email
            </span>
            <span className="font-semibold text-slate-900 text-xs truncate block">
              {booking.contact_email}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Amount Paid (Demo)
            </span>
            <span className="font-bold text-slate-900 text-xs">
              {formatCurrency(booking.total_amount)}
            </span>
          </div>
        </div>

        {/* Visitors Breakdown */}
        {booking.visitors && booking.visitors.length > 0 && (
          <div className="text-left pt-3 border-t border-amber-200/80">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              Registered Visitors:
            </span>
            <div className="space-y-1.5">
              {booking.visitors.map((vis, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-white/80 px-3 py-2 rounded-xl border border-amber-200/50"
                >
                  <div className="font-semibold text-slate-900">
                    {idx + 1}. {vis.full_name} ({vis.age} yrs)
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100">
                      {vis.category_name}
                    </span>
                    {vis.id_proof_type && (
                      <span className="hidden sm:inline">
                        &bull; {vis.id_proof_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simulated Notice */}
      <div className="p-3.5 bg-blue-50 text-blue-900 rounded-xl text-xs flex items-center gap-2 border border-blue-200">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Simulated Gate Checkout:</strong> This reservation record has been saved to the database. Present your reference number or scan the QR code above at the turnstile. Passes automatically expire after 3 hours.
        </span>
      </div>

      {/* Main Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button
          variant="outline"
          className="w-full sm:w-1/2"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4 mr-1.5 text-slate-600" />
          Print / Save PDF Pass
        </Button>
        <Button
          variant="primary"
          className="w-full sm:w-1/2"
          onClick={onBookAnother}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Book Another Visit
        </Button>
      </div>

      {/* Interactive Turnstile Simulator Modal */}
      {isScannerOpen && (
        <TurnstileScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          destinationId={booking.destination_id || ""}
          destinationName={booking.destination_name || "Heritage Monument"}
          initialTicketRef={booking.booking_reference}
          onScanCompleted={() => {
            setScanNotice(`✅ Successfully scanned at ${booking.destination_name || "Monument"} turnstile!`);
            setTimeout(() => setScanNotice(null), 4000);
          }}
        />
      )}
    </GlassCard>
  );
};
