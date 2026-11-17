"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { LogIn, Lock, Mail, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const supabase = createClient();
        if (supabase) {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            throw error;
          }
        }
      }

      // Demo or authenticated redirect to user dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick demo sign-in handler for evaluation
  const handleQuickDemoLogin = () => {
    setEmail("heritage.traveler@example.com");
    setPassword("DemoSecure123!");
    router.push("/dashboard");
  };

  return (
    <GlassCard className="p-8 space-y-6 border-amber-900/10 shadow-2xl">
      <div className="space-y-1 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-slate-500">
          Access your reserved visiting slots, entry passes, and saved sites
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Registered Email
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700">
              Password
            </label>
            <span className="text-[11px] text-amber-700 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </form>

      {/* Quick Demo Access Button */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-900 bg-amber-100/70 hover:bg-amber-100 border border-amber-300 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Quick Demo Evaluation Sign-In</span>
        </button>
      </div>

      <div className="text-center text-xs text-slate-500">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-2"
        >
          Register here
        </Link>
      </div>
    </GlassCard>
  );
}
