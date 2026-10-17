import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Shiprocket-compliant Webhook endpoint (does NOT contain restricted keywords like shiprocket, kartrocket, sr, kr)
export async function POST(req: Request) {
  try {
    // 1. Authenticate the Webhook (if token configured)
    const apiKey = req.headers.get("x-api-key");
    const secretToken = process.env.SHIPROCKET_WEBHOOK_TOKEN;

    if (secretToken && apiKey !== secretToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse payload
    const payload = await req.json().catch(() => ({}));

    if (!payload || !payload.order_id) {
      return NextResponse.json({ success: true, message: "No order ID in payload" }, { status: 200 });
    }

    const orderId = String(payload.order_id);
    const currentStatus = payload.current_status || payload.status || "Updated";
    const awb = payload.awb || payload.awb_code || null;
    const courier = payload.courier_name || null;

    console.log(`Shiprocket Webhook received: Order ${orderId} status is ${currentStatus}`);

    // 3. Update the global order in Supabase
    try {
      await supabaseAdmin
        .from("orders")
        .update({
          order_status: currentStatus,
          status: currentStatus,
          shiprocket: {
            status: currentStatus,
            awb_code: awb,
            courier_name: courier,
            updated_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    } catch (dbErr) {
      console.warn("Failed to update order in Supabase from webhook:", dbErr);
    }

    return NextResponse.json({ success: true, status: currentStatus }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
