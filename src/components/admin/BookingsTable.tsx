"use client";

import React, { useState } from "react";
import { Booking, BookingStatus } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Search, CheckCircle, Clock, XCircle, Users } from "lucide-react";

interface BookingsTableProps {
  initialBookings: Booking[];
}

export const BookingsTable: React.FC<BookingsTableProps> = ({ initialBookings }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.booking_reference.toLowerCase().includes(search.toLowerCase()) ||
      b.visitor_lead_name.toLowerCase().includes(search.toLowerCase()) ||
      b.contact_email.toLowerCase().includes(search.toLowerCase()) ||
      (b.destination_name || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || b.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-slate-900">
            Visitor Reservation Telemetry & Logs
          </h3>
          <p className="text-xs text-slate-500">
            Track entry passes, lead credentials, and check-in validity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference or visitor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Monument</th>
                <th className="py-3 px-4">Visit Date & Slot</th>
                <th className="py-3 px-4">Lead Contact</th>
                <th className="py-3 px-4">Party Size</th>
                <th className="py-3 px-4">Tariff</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {b.booking_reference}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {b.destination_name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900 block">
                      {formatDate(b.visit_date)}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[140px]">
                      {b.slot_label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">
                      {b.visitor_lead_name}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {b.contact_email}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {b.total_visitors} Visitors
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatCurrency(b.total_amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        handleStatusChange(
                          b.id,
                          e.target.value as BookingStatus
                        )
                      }
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
