import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "@/services/authService";

export async function POST(request: NextRequest) {
  try {
    await logoutUser();
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully from Heritage Guard.",
    });

    response.cookies.delete("hg_user_email");
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
