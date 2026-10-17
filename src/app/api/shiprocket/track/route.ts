import { NextResponse } from "next/server";
import { trackShipment } from "@/lib/shiprocket";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "AWB or Order ID is required" }, { status: 400 });
    }

    const result = await trackShipment(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to track shipment" }, { status: 500 });
  }
}
