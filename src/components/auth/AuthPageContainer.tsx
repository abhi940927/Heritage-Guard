"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Compass,
  MapPin,
  Calendar,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Luggage,
  Plane,
  Award,
  Globe2,
} from "lucide-react";

interface AuthPageContainerProps {
  initialMode?: "login" | "register";
}

const DESTINATION_SHOWCASE = [
  {
    name: "Taj Mahal, Agra",
    state: "Uttar Pradesh",
    tagline: "Eternal White Marble Wonder & Mughal Jewel",
    image: "/images/destinations/taj-mahal.jpg",
    badge: "UNESCO World Heritage #252",
    code: "AGR-01",
  },
  {
    name: "Amer Fort & Palace, Jaipur",
    state: "Rajasthan",
    tagline: "Hilltop Citadel of Rajput Chivalry & Sheesh Mahal",
    image: "/images/destinations/amer-fort.jpg",
    badge: "Hill Forts of Rajasthan",
    code: "JAI-05",
  },
  {
    name: "Qutub Minar, New Delhi",
    state: "Delhi NCT",
    tagline: "72.5m Fluted Red Sandstone Minaret of Victory",
    image: "/images/destinations/qutub-minar.jpg",
    badge: "Mehrauli Archaeological Park",
    code: "DEL-03",
  },
  {
    name: "Ajanta Rock-Cut Caves",
    state: "Maharashtra",
    tagline: "Ancient Basalt Monasteries & Fresco Sanctuaries",
    image: "/images/destinations/ajanta-caves.jpg",
    badge: "2nd Century BCE Heritage",
    code: "AJN-07",
  },
];

export const AuthPageContainer: React.FC<AuthPageContainerProps> = ({
  initialMode = "login",
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [activeSlide, setActiveSlide] = useState(0);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-cycle destination images
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % DESTINATION_SHOWCASE.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate Full Name
    if (!fullName.trim()) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }

    // Validate Gmail / Email
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid Gmail / Email address.");
      return;
    }

    // Validate DOB
    if (!dob) {
      setErrorMessage("Please provide your Date of Birth (DOB).");
      return;
    }

    // Validate Password (min 8 chars)
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify your password confirmation.");
      return;
    }

    setLoading(true);

    try {
      // 1. Direct Supabase Auth client if configured
      if (isSupabaseConfigured) {
        const supabase = createClient();
        if (supabase) {
          const { error: sbError } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              data: {
                full_name: fullName.trim(),
                dob: dob,
                phone_number: phone.trim() || null,
                role: "visitor",
              },
            },
          });
          if (sbError && !sbError.message.includes("already registered")) {
            console.warn("Supabase direct signUp warning:", sbError.message);
          }
        }
      }

      // 2. Call local API endpoint to persist user in Supabase & session store
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          dob,
          phone_number: phone.trim() || undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setSuccessMessage(
        `🎉 Account successfully created for ${fullName}! You can now sign in with your Gmail: ${email}`
      );
      // Auto-switch to login mode with email filled
      setTimeout(() => {
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }, 1800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your Gmail and password.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      // 1. Direct Supabase Auth client if configured
      if (isSupabaseConfigured) {
        const supabase = createClient();
        if (supabase) {
          const { error: sbError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });
          if (sbError && !sbError.message.includes("Invalid login credentials")) {
            console.warn("Supabase direct login check:", sbError.message);
          }
        }
      }

      // 2. Call Auth Login endpoint
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid Gmail or password. Please verify your credentials.");
      }

      setSuccessMessage(`Welcome back, ${data.user?.full_name || "Explorer"}! Redirecting to your dashboard...`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to sign in.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setFullName("Abhinav Singh");
    setEmail("abhinav.singh@gmail.com");
    setDob("1998-05-14");
    setPhone("+91 98765 43210");
    setPassword("Abhinav123!");
    setConfirmPassword("Abhinav123!");
  };

  const currentDest = DESTINATION_SHOWCASE[activeSlide];

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 bg-white/70 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
      {/* ==================================================================== */}
      {/* LEFT COLUMN: THE INCREDIBLE INDIA TRAVEL & EXPLORATION SHOWCASE      */}
      {/* ==================================================================== */}
      <div className="lg:col-span-5 relative bg-slate-950 text-white p-8 lg:p-10 flex flex-col justify-between overflow-hidden">
        {/* Background Rotating Destination Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={currentDest.image}
            alt={currentDest.name}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
            className="object-cover opacity-50 scale-105 transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
          <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay" />
        </div>

        {/* Top Header Badge */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-semibold">
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Incredible India &bull; Heritage Explorer Pass</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Discover Heritage. <br />
            <span className="text-amber-400 font-serif italic">Travel Smarter.</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            Your single gateway to 16+ UNESCO monuments, carrying-capacity regulated entry passes, and queue-free turnstiles across India.
          </p>
        </div>

        {/* Middle Boarding Pass / Stamp Card */}
        <div className="relative z-10 my-6">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                  FEATURED SANCTUARY
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-400/30">
                {currentDest.code}
              </span>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg text-white">
                {currentDest.name}
              </h4>
              <p className="text-xs text-amber-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{currentDest.state}, India</span>
              </p>
              <p className="text-[11px] text-slate-300 mt-1 italic">
                &ldquo;{currentDest.tagline}&rdquo;
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {currentDest.badge}
              </span>
              <span className="font-mono text-amber-300 font-semibold">
                Live Sensor Telemetry
              </span>
            </div>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2 mt-3 justify-center">
            {DESTINATION_SHOWCASE.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx
                    ? "w-6 bg-amber-400"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Travel Quote & Accreditation */}
        <div className="relative z-10 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-400">
          <p className="italic text-[11px] text-slate-300">
            &ldquo;India is the cradle of the human race, the birthplace of human speech, the mother of history, the grandmother of legend...&rdquo;
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Official Directorate of Tourism</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* RIGHT COLUMN: MODERN INTERACTIVE GLASSMORPHIC AUTHENTICATION FORM    */}
      {/* ==================================================================== */}
      <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white/80 backdrop-blur-xl">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Segmented Mode Switcher (Login vs Register) */}
          <div className="p-1.5 bg-slate-100/90 rounded-2xl flex items-center border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-md border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Explorer Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-md border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              {mode === "login"
                ? "Welcome Back, Explorer"
                : "Register for Heritage Exploration"}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === "login"
                ? "Sign in with your registered Gmail to manage visiting passes and fast-track entries"
                : "Fill in your details below to register and start exploring India's wonders"}
            </p>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================================================================ */}
          {/* REGISTER FORM                                                    */}
          {/* ================================================================ */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name (as per ID) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Abhinav Singh"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 font-medium placeholder:text-slate-400 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Gmail / Email */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Gmail / Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abhinav.singh@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 font-medium placeholder:text-slate-400 text-xs"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  You will sign in using this Gmail address.
                </span>
              </div>

              {/* Date of Birth (DOB) & Phone Number (Optional) Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date of Birth */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date of Birth (DOB) *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full pl-9 pr-3 py-2 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 font-mono text-xs"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    For age-categorized passes
                  </span>
                </div>

                {/* Mobile Number (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      Mobile Number
                    </label>
                    <span className="text-[10px] text-amber-700 font-medium">Optional</span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 text-xs placeholder:text-slate-400"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    SMS gate clearance alerts
                  </span>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password (8+ characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter at least 8 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 text-xs"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Realtime Character Validation Indicator */}
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                      password.length >= 8 ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3 h-3 ${
                        password.length >= 8 ? "text-emerald-600" : "text-slate-300"
                      }`}
                    />
                    {password.length >= 8 ? "8+ characters valid" : "Must be 8 characters or more"}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 text-xs"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {/* Quick Fill Button for testing */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 underline underline-offset-2"
                >
                  <Sparkles className="w-3 h-3" />
                  Fill &ldquo;Abhinav Singh&rdquo; details
                </button>
              </div>

              {/* Submit Registration */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold shadow-lg shadow-amber-600/20 mt-2"
                disabled={loading}
              >
                {loading ? (
                  "Saving to Supabase & Creating Profile..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Create Explorer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* ================================================================ */}
          {/* LOGIN FORM                                                       */}
          {/* ================================================================ */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {/* Gmail / Email */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Registered Gmail / Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abhinav.singh@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 font-medium placeholder:text-slate-400 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">
                    Password (8+ characters) *
                  </label>
                  <span className="text-[11px] text-amber-700 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your 8-character password"
                    className="w-full pl-9 pr-10 py-2.5 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 text-xs"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Fill Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">
                  Data securely verified in Supabase
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("abhinav.singh@gmail.com");
                    setPassword("Abhinav123!");
                  }}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 underline underline-offset-2"
                >
                  <Sparkles className="w-3 h-3" />
                  Sign in as Abhinav Singh
                </button>
              </div>

              {/* Submit Sign In */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold shadow-lg shadow-amber-600/20 mt-2"
                disabled={loading}
              >
                {loading ? (
                  "Verifying Credentials in Supabase..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Sign In to Explorer Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            {mode === "login" ? (
              <p>
                Don&apos;t have an explorer account yet?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Sign in with your Gmail
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
