"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, RefreshCw, CheckCircle2, Timer, AlertTriangle } from "lucide-react";

interface MiniQRCodeProps {
  reference: string;
  destinationName: string;
  size?: number;
  issuedAt?: string;
  expiresAt?: string;
}

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export const MiniQRCode: React.FC<MiniQRCodeProps> = ({
  reference,
  destinationName,
  size = 120,
  issuedAt,
  expiresAt,
}) => {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [token, setToken] = useState<string>(() => `${reference}-${Date.now().toString(36).toUpperCase()}`);
  const initialExpiresMs = expiresAt
    ? new Date(expiresAt).getTime()
    : issuedAt
    ? new Date(issuedAt).getTime() + THREE_HOURS_MS
    : Date.now() + THREE_HOURS_MS;

  const [expiresTimestampMs, setExpiresTimestampMs] = useState<number>(initialExpiresMs);
  const [isExpired, setIsExpired] = useState<boolean>(() => Date.now() >= initialExpiresMs);

  useEffect(() => {
    const checkExpiry = () => {
      setIsExpired(Date.now() >= expiresTimestampMs);
    };
    checkExpiry();
    const interval = setInterval(checkExpiry, 5000);
    return () => clearInterval(interval);
  }, [expiresTimestampMs]);

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        ref: reference,
        monument: destinationName,
        token,
        expires_at: new Date(expiresTimestampMs).toISOString(),
        validity: "3 Hours",
        verified: true,
      }),
      {
        width: size * 2,
        margin: 1,
        color: {
          dark: isExpired ? "#64748B" : "#0F172A",
          light: "#FFFFFF",
        },
      }
    )
      .then(setDataUrl)
      .catch(console.error);
  }, [reference, destinationName, size, token, expiresTimestampMs, isExpired]);

  const regenerate = async () => {
    const now = Date.now();
    const newExpires = now + THREE_HOURS_MS;
    setToken(`${reference}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    setExpiresTimestampMs(newExpires);
    setIsExpired(false);

    try {
      await fetch("/api/crowd/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "refresh",
          ticket_reference: reference,
          qr_issued_timestamp_ms: now,
        }),
      });
    } catch (e) {
      console.warn("Failed to sync mini QR refresh:", e);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200 shadow-sm relative">
      {dataUrl ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt={`Turnstile Entry QR ${reference}`}
            style={{ width: size, height: size }}
            className={`rounded-lg object-contain ${isExpired ? "opacity-30 grayscale" : ""}`}
          />
          {isExpired && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 rounded-lg text-white p-1 text-center">
              <AlertTriangle className="w-4 h-4 text-rose-400 mb-0.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300">Expired</span>
              <span className="text-[8px] text-slate-200">3h Limit</span>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{ width: size, height: size }}
          className="flex items-center justify-center bg-slate-50 text-slate-300 rounded-lg"
        >
          <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
        </div>
      )}
      <div className="flex items-center justify-between w-full px-1 text-[10px] font-mono text-slate-500">
        <span
          className={`flex items-center gap-1 font-bold ${
            isExpired ? "text-rose-600" : "text-emerald-700"
          }`}
        >
          {isExpired ? (
            <>
              <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
              Expired
            </>
          ) : (
            <>
              <Timer className="w-2.5 h-2.5 text-emerald-600" />
              Valid 3h
            </>
          )}
        </span>
        <button
          type="button"
          onClick={regenerate}
          className="text-amber-700 hover:text-amber-900 underline font-semibold"
          title="Renew for 3 hours"
        >
          {isExpired ? "Renew" : "Regen"}
        </button>
      </div>
    </div>
  );
};
