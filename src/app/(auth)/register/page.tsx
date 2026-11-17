"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { UserPlus, User, Lock, Mail, Phone, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const supabase = createClient();
        if (supabase) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone_number: phone,
                role: "visitor",
              },
            },
          });
          if (error) {
            throw error;
          }
        }
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to register";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="p-8 space-y-6 border-amber-900/10 shadow-2xl">
      <div className="space-y-1 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Create Explorer Account
        </h2>
        <p className="text-xs text-slate-500">
          Join Heritage Guard to book crowd-managed time slots and manage passes
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Mobile Number (Optional)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Password (Min 8 Characters) *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-2"
        >
          Sign in
        </Link>
      </div>
    </GlassCard>
  );
}
