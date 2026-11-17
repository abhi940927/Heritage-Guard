import { NextRequest, NextResponse } from "next/server";
import { registerNewUser } from "@/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, dob, phone_number } = body;

    const result = await registerNewUser({
      email,
      password,
      full_name,
      dob,
      phone_number,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      message: `Account created successfully for ${result.user?.full_name}! You can now sign in with your Gmail.`,
      user: {
        id: result.user?.id,
        email: result.user?.email,
        full_name: result.user?.full_name,
        dob: result.user?.dob,
        phone_number: result.user?.phone_number,
        role: result.user?.role,
      },
    });

    // Set auth cookie
    response.cookies.set("hg_user_email", result.user!.email, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
