"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { MiniQRCode } from "@/components/booking/MiniQRCode";
import {
  Calendar,
  Clock,
  Ticket,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface BookingHistoryListProps {
  bookings: Booking[];
}

export const BookingHistoryList: React.FC<BookingHistoryListProps> = ({ bookings }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (bookings.length === 0) {
    return (
      <GlassCard className="p-8 text-center space-y-3">
        <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-serif font-bold text-slate-800 text-lg">
          No Scheduled Heritage Visits Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our featured monuments and book your preferred crowd-managed visiting slot to experience history without waiting in line.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const isExpanded = expandedId === b.id;
        return (
          <GlassCard key={b.id} className="p-5 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    {b.booking_reference}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Confirmed
                  </span>
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-base">
                  {b.destination_name}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {formatDate(b.visit_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {b.slot_label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {b.total_visitors} Visitor(s)
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(b.total_amount)}
                  </span>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : b.id)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium flex items-center gap-1"
                >
                  <span>{isExpanded ? "Hide Pass" : "View Pass"}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Scannable Dynamic QR Code */}
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <MiniQRCode
                      reference={b.booking_reference}
                      destinationName={b.destination_name || "Heritage Monument"}
                      size={110}
                      issuedAt={b.qr_issued_at}
                      expiresAt={b.qr_expires_at}
                    />
                  </div>

                  <div className="flex-1 p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs space-y-3 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950">
                        Primary Lead: {b.visitor_lead_name}
                      </span>
                      <span className="text-slate-500">Email: {b.contact_email}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block mb-1.5">
                        Visitor Roster:
                      </span>
                      <div className="space-y-1">
                        {b.visitors && b.visitors.length > 0 ? (
                          b.visitors.map((v, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between bg-white/70 p-2 rounded-lg text-slate-800"
                            >
                              <span>
                                {i + 1}. {v.full_name} ({v.age} yrs)
                              </span>
                              <span className="text-slate-500">
                                {v.category_name} • {v.id_proof_type || "ID Proof"}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="bg-white/70 p-2 rounded-lg text-slate-800">
                            {b.visitor_lead_name} (Lead)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-amber-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print Entry Voucher Pass
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
};
