import React, { Suspense } from "react";
import { Metadata } from "next";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export const metadata: Metadata = {
  title: "Create Explorer Account | Heritage Site Crowd Management System",
  description:
    "Register for a verified Heritage Explorer account to book priority visiting slots, access UNESCO & ASI monuments, and view live crowd telemetry.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-xs">Loading registration portal...</div>}>
      <AuthPageContainer initialMode="register" />
    </Suspense>
  );
}
