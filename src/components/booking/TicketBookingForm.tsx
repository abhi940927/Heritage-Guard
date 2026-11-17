"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Destination, VisitingTimeSlot, TicketCategory, Booking } from "@/types";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { BookingVoucherPass } from "./BookingVoucherPass";
import {
  Calendar,
  Clock,
  User,
  Users,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  AlertCircle,
  Building2,
  Download,
  Share2,
} from "lucide-react";

interface TicketBookingFormProps {
  destinations: Destination[];
  initialDestinationSlug?: string;
  initialTimeSlots?: VisitingTimeSlot[];
  initialTicketCategories?: TicketCategory[];
  currentUser?: {
    id: string;
    email: string;
    full_name: string;
    dob?: string;
    phone_number?: string;
  } | null;
}

export const TicketBookingForm: React.FC<TicketBookingFormProps> = ({
  destinations,
  initialDestinationSlug,
  initialTimeSlots = [],
  initialTicketCategories = [],
  currentUser = null,
}) => {
  const [activeUser, setActiveUser] = useState(currentUser);
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialDestinationSlug || (destinations[0]?.slug ?? "taj-mahal")
  );

  const selectedDestination = useMemo(() => {
    return (
      destinations.find((d) => d.slug === selectedSlug) || destinations[0]
    );
  }, [destinations, selectedSlug]);

  const [visitDate, setVisitDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [selectedSlotId, setSelectedSlotId] = useState<string>("ts-taj-1");
  const [leadName, setLeadName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [visitors, setVisitors] = useState<
    {
      fullName: string;
      age: number;
      categoryName: string;
      idProofType: string;
      idProofNumber: string;
    }[]
  >([
    {
      fullName: "",
      age: 30,
      categoryName: "Indian Citizen",
      idProofType: "Aadhaar Card",
      idProofNumber: "",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  // Auto-prefill authenticated user details if logged in
  useEffect(() => {
    const applyUser = (user: {
      id: string;
      email: string;
      full_name: string;
      dob?: string;
      phone_number?: string;
    }) => {
      setActiveUser(user);
      if (!leadName) setLeadName(user.full_name || "");
      if (!email) setEmail(user.email || "");
      if (!phone && user.phone_number) setPhone(user.phone_number);

      let calculatedAge = 28;
      if (user.dob) {
        const birthYear = new Date(user.dob).getFullYear();
        if (!isNaN(birthYear)) {
          calculatedAge = Math.max(1, new Date().getFullYear() - birthYear);
        }
      }

      setVisitors((prev) => {
        if (prev.length > 0 && !prev[0].fullName) {
          return [
            {
              ...prev[0],
              fullName: user.full_name || "",
              age: calculatedAge,
            },
            ...prev.slice(1),
          ];
        }
        return prev;
      });
    };

    if (currentUser) {
      applyUser(currentUser);
    } else {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            applyUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  // Time slots for selected destination
  const availableSlots = useMemo(() => {
    const slots = initialTimeSlots.filter(
      (s) => s.destination_id === selectedDestination?.id
    );
    if (slots.length > 0) return slots;
    return [
      {
        id: "slot-gen-1",
        destination_id: selectedDestination?.id,
        start_time: "08:00:00",
        end_time: "11:00:00",
        label: "Morning Batch (08:00 - 11:00)",
        max_capacity: 2500,
        expected_crowd_level: "Low" as const,
      },
      {
        id: "slot-gen-2",
        destination_id: selectedDestination?.id,
        start_time: "11:30:00",
        end_time: "14:30:00",
        label: "Midday Batch (11:30 - 14:30)",
        max_capacity: 3500,
        expected_crowd_level: "High" as const,
      },
      {
        id: "slot-gen-3",
        destination_id: selectedDestination?.id,
        start_time: "15:00:00",
        end_time: "18:00:00",
        label: "Late Afternoon Sunset (15:00 - 18:00)",
        max_capacity: 3000,
        expected_crowd_level: "Moderate" as const,
      },
    ];
  }, [selectedDestination, initialTimeSlots]);

  // Categories for pricing
  const availableCategories = useMemo(() => {
    const cats = initialTicketCategories.filter(
      (c) => c.destination_id === selectedDestination?.id
    );
    if (cats.length > 0) return cats;
    return [
      {
        id: "cat-1",
        destination_id: selectedDestination?.id,
        category_name: "Indian Citizen",
        price: selectedDestination?.base_ticket_price || 50,
        currency: "INR",
        description: "Official Government Photo ID required at turnstile",
      },
      {
        id: "cat-2",
        destination_id: selectedDestination?.id,
        category_name: "Foreign Tourist",
        price: 550,
        currency: "INR",
        description: "Includes fast-track priority lane access",
      },
      {
        id: "cat-3",
        destination_id: selectedDestination?.id,
        category_name: "Child (Below 15 Years)",
        price: 0,
        currency: "INR",
        description: "Complimentary entry with valid age verification proof",
      },
    ];
  }, [selectedDestination, initialTicketCategories]);

  // Price calculation
  const totalAmount = useMemo(() => {
    return visitors.reduce((sum, v) => {
      const cat = availableCategories.find(
        (c) => c.category_name === v.categoryName
      );
      return sum + (cat ? cat.price : selectedDestination?.base_ticket_price || 50);
    }, 0);
  }, [visitors, availableCategories, selectedDestination]);

  const addVisitor = () => {
    if (visitors.length >= 6) return;
    setVisitors((prev) => [
      ...prev,
      {
        fullName: "",
        age: 25,
        categoryName: "Indian Citizen",
        idProofType: "Aadhaar Card",
        idProofNumber: "",
      },
    ]);
  };

  const removeVisitor = (index: number) => {
    if (visitors.length <= 1) return;
    setVisitors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVisitorChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setVisitors((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!leadName.trim()) {
      setErrorMessage("Please provide the primary lead visitor's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid contact email for ticket delivery.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please provide a contact phone number.");
      return;
    }

    const uncompletedVisitor = visitors.find((v) => !v.fullName.trim());
    if (uncompletedVisitor) {
      setErrorMessage("Please enter full names for all registered visitors.");
      return;
    }

    setIsSubmitting(true);

    try {
      const chosenSlot = availableSlots.find((s) => s.id === selectedSlotId);
      const slotLabel = chosenSlot
        ? chosenSlot.label
        : "Standard Morning Slot (09:00 - 12:00)";

      const payload = {
        destinationId: selectedDestination.id,
        destinationName: selectedDestination.name,
        destinationSlug: selectedDestination.slug,
        timeSlotId: selectedSlotId,
        slotLabel,
        visitDate,
        leadName,
        email,
        phone,
        visitors,
        totalAmount,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Server rejected booking creation");
      }

      const booking: Booking = await response.json();
      setConfirmedBooking(booking);
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to complete reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If booking is confirmed, show the voucher modal with real dynamic QR Code
  if (confirmedBooking) {
    return (
      <BookingVoucherPass
        booking={confirmedBooking}
        onBookAnother={() => {
          setConfirmedBooking(null);
          setLeadName("");
          setVisitors([
            {
              fullName: "",
              age: 28,
              categoryName: "Indian Citizen",
              idProofType: "Aadhaar Card",
              idProofNumber: "",
            },
          ]);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmitBooking} className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Authenticated Explorer Status Bar */}
      {activeUser && (
        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {activeUser.full_name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Verified Explorer Account
                </span>
              </div>
              <span className="text-[11px] text-slate-600">
                Official passes and QR vouchers will be issued to: <strong>{activeUser.email}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-900 underline text-xs font-semibold self-end sm:self-auto"
          >
            Sign Out / Switch Account
          </button>
        </div>
      )}

      {/* Step 1: Select Destination */}
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold border-b border-slate-200/60 pb-3">
          <Building2 className="w-4 h-4 text-amber-600" />
          <span>1. Select Heritage Monument / Site</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {destinations.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedSlug(d.slug)}
              className={`p-3.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                selectedSlug === d.slug
                  ? "bg-amber-100/70 border-amber-500 shadow-sm ring-2 ring-amber-500/20 text-slate-900"
                  : "bg-white/60 border-slate-200 hover:border-amber-300 text-slate-700"
              }`}
            >
              <div>
                <span className="font-bold block text-sm line-clamp-1">
                  {d.name}
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  {d.state}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <CrowdStatusBadge level={d.current_crowd_level} size="sm" showDot={false} />
                <span className="font-semibold text-slate-900">
                  {formatCurrency(d.base_ticket_price)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Step 2: Date & Visiting Slot */}
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold border-b border-slate-200/60 pb-3">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>2. Select Visit Date & Crowd-Managed Time Slot</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Scheduled Date
            </label>
            <input
              type="date"
              value={visitDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
              required
            />
            {selectedDestination?.closed_days?.length > 0 && (
              <p className="text-[11px] text-amber-700 mt-1">
                Notice: Closed weekly on {selectedDestination.closed_days.join(", ")}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Available Entry Window (Capacity-Governed)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedSlotId === slot.id
                      ? "bg-amber-100/80 border-amber-500 shadow-sm ring-2 ring-amber-500/20 text-slate-900 font-semibold"
                      : "bg-white/60 border-slate-200 hover:border-amber-300 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{slot.label}</span>
                  </div>
                  <CrowdStatusBadge level={slot.expected_crowd_level} size="sm" showDot={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Step 3: Visitors Details */}
      <GlassCard className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold">
            <Users className="w-4 h-4 text-amber-600" />
            <span>3. Visitor Credentials & Category</span>
          </div>
          <button
            type="button"
            onClick={addVisitor}
            disabled={visitors.length >= 6}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 disabled:opacity-40"
          >
            + Add Another Visitor (Max 6)
          </button>
        </div>

        {/* Lead Visitor Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-amber-50/40 border border-amber-200/60">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Lead Visitor Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Email for E-Ticket *
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Mobile Contact Number *
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        {/* Individual Visitors */}
        <div className="space-y-3">
          {visitors.map((visitor, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="sm:w-8 font-semibold text-xs text-slate-400">
                #{idx + 1}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Visitor Full Name"
                  value={visitor.fullName}
                  onChange={(e) =>
                    handleVisitorChange(idx, "fullName", e.target.value)
                  }
                  className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />

                <input
                  type="number"
                  placeholder="Age"
                  min={1}
                  max={110}
                  value={visitor.age}
                  onChange={(e) =>
                    handleVisitorChange(idx, "age", Number(e.target.value))
                  }
                  className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />

                <select
                  value={visitor.categoryName}
                  onChange={(e) =>
                    handleVisitorChange(idx, "categoryName", e.target.value)
                  }
                  className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.category_name}>
                      {c.category_name} ({formatCurrency(c.price)})
                    </option>
                  ))}
                </select>

                <select
                  value={visitor.idProofType}
                  onChange={(e) =>
                    handleVisitorChange(idx, "idProofType", e.target.value)
                  }
                  className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Driver License">Driver License</option>
                  <option value="Student Photo ID">Student Photo ID</option>
                </select>
              </div>

              {visitors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVisitor(idx)}
                  className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Step 4: Summary & Instant Confirmation */}
      <GlassCard variant="gold" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-300/80 pb-4">
          <div>
            <h4 className="font-serif font-bold text-lg text-amber-950">
              Booking Summary & Tariff Breakdown
            </h4>
            <p className="text-xs text-amber-900/80">
              {visitors.length} visitor(s) reserved for {selectedDestination.name}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-amber-900 block font-medium">
              Payable Entry Tariff
            </span>
            <span className="text-2xl font-serif font-bold text-amber-950">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-amber-900/80 max-w-md">
            By confirming, you agree to official Archaeological Survey of India (ASI) visitor guidelines. Digital QR passes will be generated immediately upon reservation.
          </p>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full sm:w-auto px-8"
          >
            <Ticket className="w-5 h-5 mr-2" />
            Generate Entry Pass (Demo)
          </Button>
        </div>
      </GlassCard>
    </form>
  );
};
