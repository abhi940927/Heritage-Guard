"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, RefreshCw, CheckCircle2 } from "lucide-react";

interface MiniQRCodeProps {
  reference: string;
  destinationName: string;
  size?: number;
}

export const MiniQRCode: React.FC<MiniQRCodeProps> = ({
  reference,
  destinationName,
  size = 120,
}) => {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [token, setToken] = useState<string>(() => `${reference}-${Date.now().toString(36).toUpperCase()}`);

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        ref: reference,
        monument: destinationName,
        token,
        verified: true,
      }),
      {
        width: size * 2,
        margin: 1,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
      }
    )
      .then(setDataUrl)
      .catch(console.error);
  }, [reference, destinationName, size, token]);

  const regenerate = () => {
    setToken(`${reference}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  };

  return (
    <div className="flex flex-col items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt={`Turnstile Entry QR ${reference}`}
          style={{ width: size, height: size }}
          className="rounded-lg object-contain"
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="flex items-center justify-center bg-slate-50 text-slate-300 rounded-lg"
        >
          <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
        </div>
      )}
      <div className="flex items-center justify-between w-full px-1 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1 text-emerald-700 font-bold">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
          Live
        </span>
        <button
          type="button"
          onClick={regenerate}
          className="text-amber-700 hover:text-amber-900 underline"
          title="Refresh dynamic gate token"
        >
          Regen
        </button>
      </div>
    </div>
  );
};
