import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the Webhook
    const apiKey = req.headers.get("x-api-key");
    const secretToken = process.env.SHIPROCKET_WEBHOOK_TOKEN;
    
    if (!secretToken || apiKey !== secretToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse payload
    const payload = await req.json();
    
    if (!payload || !payload.awb) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const orderId = payload.order_id;
    const currentStatus = payload.current_status; // e.g., "SHIPPED", "DELIVERED"
    
    if (!orderId) {
       return NextResponse.json({ success: true, message: "No order ID mapped" }, { status: 200 });
    }

    // 3. Find the order in Firebase across all users (since we only have the Razorpay order ID)
    // We have to query a collection group if we don't know the UID, but Firebase Admin is better for this.
    // However, on the client API side, we can just log it or handle it if we stored orders globally.
    // Since orders are stored in users/{uid}/orders, we need a global mapping.
    
    // For now, this endpoint successfully receives the webhook and responds 200 to satisfy Shiprocket.
    console.log(`Webhook received: Order ${orderId} is now ${currentStatus}`);

    return NextResponse.json({ success: true, status: currentStatus }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
