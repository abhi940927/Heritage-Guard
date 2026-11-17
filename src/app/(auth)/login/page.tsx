import React from "react";
import { Metadata } from "next";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export const metadata: Metadata = {
  title: "Explorer Sign In | Heritage Site Crowd Management System",
  description:
    "Sign in to your Heritage Guard account to access carrying-capacity reserved slots, priority entry passes, and real-time crowd alerts.",
};

export default function LoginPage() {
  return <AuthPageContainer initialMode="login" />;
}
