import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { orderId, status, notes } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        order_status: status,
        status: status,
        admin_notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, orderId, status }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating order status in Supabase:", error);
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
