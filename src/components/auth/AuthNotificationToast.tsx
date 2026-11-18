"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, X, UserCheck } from "lucide-react";

export const AuthNotificationToast: React.FC = () => {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "login" | "register";
  } | null>(null);

  useEffect(() => {
    const authStatus = searchParams.get("auth_success");
    if (!authStatus) return;

    const rawUserName = searchParams.get("user_name");
    const userName = rawUserName ? decodeURIComponent(rawUserName) : "";

    if (authStatus === "google_login" || authStatus === "login") {
      setToast({
        show: true,
        title: "Login Successful",
        message: userName
          ? `Welcome back, ${userName}! Your session is active.`
          : "Welcome back! Your Google account is authenticated.",
        type: "login",
      });
    } else if (authStatus === "google_register" || authStatus === "register") {
      setToast({
        show: true,
        title: "Registration Successful",
        message: userName
          ? `Welcome to Heritage Guard, ${userName}! Your profile is ready.`
          : "Registration successful! Welcome to Heritage Guard.",
        type: "register",
      });
    }

    // Clean up query parameters from browser URL without triggering a page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_success");
      url.searchParams.delete("user_name");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
    }

    // Auto-dismiss after 6 seconds
    const timer = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, show: false } : null));
    }, 6000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (!toast || !toast.show) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-6 duration-300">
      <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/10 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-600/20">
          {toast.type === "register" ? (
            <Sparkles className="w-5 h-5" />
          ) : (
            <UserCheck className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-serif font-bold text-slate-900 text-sm">
              {toast.title}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-snug">{toast.message}</p>
        </div>

        <button
          onClick={() => setToast((prev) => (prev ? { ...prev, show: false } : null))}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
