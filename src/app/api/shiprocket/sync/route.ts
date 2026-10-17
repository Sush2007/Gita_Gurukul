import { NextResponse } from "next/server";
import { trackShipment } from "@/lib/shiprocket";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json().catch(() => ({}));

    // If a specific order is requested:
    if (orderId) {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (error || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const trackingQuery = order.shiprocket?.awb_code || order.shiprocket?.order_id || order.order_id || order.id;
      const trackResult = await trackShipment(String(trackingQuery));

      if (trackResult.success && trackResult.tracking) {
        const shipmentTrack = trackResult.tracking.shipment_track?.[0] || trackResult.tracking;
        const currentStatus = shipmentTrack.current_status || trackResult.tracking.current_status || "Updated";
        const awb = shipmentTrack.awb_code || order.shiprocket?.awb_code || null;
        const courier = shipmentTrack.courier_name || order.shiprocket?.courier_name || null;

        await supabaseAdmin
          .from("orders")
          .update({
            order_status: currentStatus,
            status: currentStatus,
            shiprocket: {
              ...(order.shiprocket || {}),
              status: currentStatus,
              awb_code: awb,
              courier_name: courier,
              updated_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        return NextResponse.json({
          success: true,
          synced: true,
          status: currentStatus,
          awb,
          courier,
        });
      }

      return NextResponse.json({
        success: false,
        message: trackResult.message || "No tracking updates available yet from courier",
      });
    }

    // Otherwise sync active store orders
    const { data: activeOrders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .neq("order_status", "Delivered")
      .neq("type", "donation")
      .limit(20);

    if (error || !activeOrders) {
      return NextResponse.json({ error: error?.message || "Failed to query orders" }, { status: 500 });
    }

    let updatedCount = 0;
    for (const ord of activeOrders) {
      const queryId = ord.shiprocket?.awb_code || ord.shiprocket?.order_id || ord.order_id || ord.id;
      if (!queryId) continue;

      try {
        const res = await trackShipment(String(queryId));
        if (res.success && res.tracking) {
          const track = res.tracking.shipment_track?.[0] || res.tracking;
          const status = track.current_status || res.tracking.current_status;
          if (status) {
            await supabaseAdmin
              .from("orders")
              .update({
                order_status: status,
                status: status,
                shiprocket: {
                  ...(ord.shiprocket || {}),
                  status: status,
                  awb_code: track.awb_code || ord.shiprocket?.awb_code,
                  courier_name: track.courier_name || ord.shiprocket?.courier_name,
                  updated_at: new Date().toISOString(),
                },
                updated_at: new Date().toISOString(),
              })
              .eq("id", ord.id);
            updatedCount++;
          }
        }
      } catch (e) {
        // Continue with next order
      }
    }

    return NextResponse.json({ success: true, updatedCount });
  } catch (err: any) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: err.message || "Failed to sync tracking" }, { status: 500 });
  }
}
