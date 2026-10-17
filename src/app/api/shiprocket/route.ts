import { NextResponse } from "next/server";
import { createShiprocketShipment } from "@/lib/shiprocket";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { orderId, amount, items, quantity, profile } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: "orderId and amount are required" }, { status: 400 });
    }

    try {
      const result = await createShiprocketShipment({
        orderId,
        amount,
        items,
        quantity: quantity || 1,
        profile: profile || {},
      });

      // Update Supabase order with shipment info
      try {
        await supabaseAdmin
          .from("orders")
          .update({
            shiprocket: {
              status: "Created",
              shipment_id: result.shipment_id || null,
              order_id: result.order_id || null,
              awb_code: result.awb_code || null,
              courier_name: result.courier_name || null,
              pickup_location: result.pickup_location,
              error: null,
              updated_at: new Date().toISOString(),
            },
            order_status: "Processing",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);
      } catch (dbErr) {
        console.warn("Could not update Supabase from Shiprocket route:", dbErr);
      }

      return NextResponse.json(result, { status: 200 });
    } catch (shiprocketErr: any) {
      const errorMessage = shiprocketErr?.message || "Shiprocket shipment creation failed";
      console.error("Shiprocket creation error:", errorMessage);

      // Record failure on the order document in Supabase
      try {
        await supabaseAdmin
          .from("orders")
          .update({
            shiprocket: {
              status: "Failed",
              error: errorMessage,
              updated_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);
      } catch (dbErr) {
        console.warn("Could not update failure in Supabase:", dbErr);
      }

      return NextResponse.json(
        {
          error: errorMessage,
          success: false,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Shiprocket API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
