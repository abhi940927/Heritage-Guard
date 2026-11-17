"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to deliver message");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Failed to deliver message. Please try again or call our helpline.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <h3 className="font-serif font-bold text-xl text-slate-900">
          Send a Grievance or Inquiry
        </h3>
        <p className="text-xs text-slate-500">
          Inquiries are routed directly to the designated monument control cell.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Thank you! Your inquiry has been logged in the system. An officer will respond to your email within 24 working hours.
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Your Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Ananya Sen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="e.g. ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Subject / Purpose of Inquiry
          </label>
          <input
            type="text"
            placeholder="e.g. Group Slot Reservation, Academic Research Access, Accessibility Assistance"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Your Message *
          </label>
          <textarea
            rows={5}
            placeholder="Please detail your visit details, questions regarding guidelines, or required permissions..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 leading-relaxed"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full sm:w-auto px-6"
        >
          <Send className="w-4 h-4 mr-1.5" />
          Submit Message
        </Button>
      </form>
    </GlassCard>
  );
};
