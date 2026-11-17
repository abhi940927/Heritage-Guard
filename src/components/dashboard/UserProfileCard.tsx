import React from "react";
import { Profile } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Mail, Shield, Calendar, Award, Phone } from "lucide-react";

interface UserProfileCardProps {
  profile: Profile;
  totalBookings: number;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  totalBookings,
}) => {
  return (
    <GlassCard className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white text-2xl font-serif font-bold shadow-md shadow-amber-600/20">
          {profile.full_name?.charAt(0) || "U"}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              {profile.full_name}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {profile.role}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Registered Heritage Explorer &bull; Citizen Visitor
          </p>
        </div>
      </div>

      {/* User Details (Email, DOB, Phone) */}
      <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
        {profile.email && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>Email Account</span>
            </span>
            <span className="font-medium text-slate-900">{profile.email}</span>
          </div>
        )}
        {profile.dob && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Date of Birth</span>
            </span>
            <span className="font-mono font-medium text-slate-900">{profile.dob}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>Mobile Contact</span>
          </span>
          <span className="font-mono text-slate-900">
            {profile.phone_number || "Not provided (Optional)"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50/80">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Total Passes</span>
          </div>
          <span className="text-lg font-bold text-slate-900">
            {totalBookings} Passes
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/80">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Patron Status</span>
          </div>
          <span className="text-lg font-bold text-emerald-700">
            Verified Explorer
          </span>
        </div>
      </div>
    </GlassCard>
  );
};
