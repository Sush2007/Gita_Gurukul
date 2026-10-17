import { NextResponse } from "next/server";
import { checkShiprocketHealth, getPickupLocations } from "@/lib/shiprocket";

export async function GET() {
  try {
    const health = await checkShiprocketHealth();
    return NextResponse.json(health, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { connected: false, error: error.message || "Failed to check status" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();

    let testToken = token?.trim();

    if (!testToken && email && password) {
      const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const authData = await authRes.json();
      if (!authRes.ok || !authData.token) {
        return NextResponse.json(
          {
            connected: false,
            error: authData.message || (authData.errors ? JSON.stringify(authData.errors) : "Invalid credentials"),
          },
          { status: 400 }
        );
      }
      testToken = authData.token;
    }

    if (!testToken) {
      return NextResponse.json({ error: "Token or credentials required" }, { status: 400 });
    }

    const pickups = await getPickupLocations(testToken);
    return NextResponse.json(
      {
        connected: true,
        pickupLocationsCount: pickups.length,
        pickupLocations: pickups.map((l) => ({
          nickname: l.pickup_location,
          city: l.city,
          state: l.state,
          pincode: l.pin_code,
        })),
        token: testToken,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message || "Test failed" }, { status: 500 });
  }
}
