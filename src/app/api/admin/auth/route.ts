import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();

    const expectedPasscode = process.env.ADMIN_PASSCODE || "gurukul2026";

    if (passcode && passcode.trim() === expectedPasscode.trim()) {
      return NextResponse.json({ success: true, message: "Authenticated" }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: "Invalid passcode" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
