import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cancelShiprocketOrder } from "@/lib/shiprocket";

export async function POST(req: Request) {
  try {
    const { orderId, userId, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    // Fetch the order from Supabase
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify ownership if userId is supplied
    if (userId && order.user_id && order.user_id !== userId && userId !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Cannot cancel if already dispatched or delivered
    const currentStatus = (order.order_status || order.status || "").toLowerCase();
    if (currentStatus === "shipped" || currentStatus === "delivered") {
      return NextResponse.json(
        { error: "This package has already been dispatched with the courier and cannot be cancelled automatically. Please contact Gurukul support." },
        { status: 400 }
      );
    }

    // Attempt cancellation in Shiprocket if order was created there
    const srOrderId = order.shiprocket?.order_id;
    if (srOrderId) {
      await cancelShiprocketOrder(srOrderId);
    }

    // Update order status in Supabase
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        order_status: "Cancelled",
        status: "Cancelled",
        admin_notes: reason ? `Cancellation reason: ${reason}` : "Cancelled by user",
        shiprocket: {
          ...(order.shiprocket || {}),
          status: "Cancelled",
          updated_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, message: "Order cancelled successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Order cancellation error:", error);
    return NextResponse.json({ error: error.message || "Failed to cancel order" }, { status: 500 });
  }
}
