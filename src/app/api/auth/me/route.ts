import { NextRequest, NextResponse } from "next/server";
import { getCurrentActiveUser } from "@/services/authService";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentActiveUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url || "",
        dob: user.dob,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: "Failed to fetch user session." }, { status: 500 });
  }
}
