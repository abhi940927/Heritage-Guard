import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await loginUser({ email, password });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || "Authentication failed." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Welcome back to India Heritage Guard, ${result.user.full_name}!`,
      user: {
        id: result.user.id,
        email: result.user.email,
        full_name: result.user.full_name,
        dob: result.user.dob,
        phone_number: result.user.phone_number,
        role: result.user.role,
      },
    });

    // Senior Developer Hardened Session Cookie
    response.cookies.set("hg_user_email", result.user.email.toLowerCase(), {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error during login." },
      { status: 500 }
    );
  }
}
