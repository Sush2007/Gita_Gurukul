import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId, amount, items, profile } = await req.json();

    if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
      console.warn("Shiprocket credentials not found in environment variables");
      return NextResponse.json({ error: "Shiprocket credentials missing" }, { status: 500 });
    }

    // 1. Authenticate with Shiprocket
    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    });

    const authData = await authRes.json();
    if (!authRes.ok || !authData.token) {
      console.error("Shiprocket Auth Error:", authData);
      return NextResponse.json({ error: "Failed to authenticate with Shiprocket" }, { status: 500 });
    }

    const token = authData.token;

    // Split name into first and last
    const nameParts = (profile.name || "Unknown").split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "User";

    // Format Date: "YYYY-MM-DD HH:mm"
    const now = new Date();
    const formattedDate = now.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 16);

    // Placeholder dimensions until diary is printed
    const length = 20;
    const breadth = 15;
    const height = 2;
    const weight = 0.5;

    // The user provided the full address as pickup location name. 
    // We can use an env var to override this if it mismatches the Shiprocket dashboard nickname.
    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";

    const orderPayload = {
      order_id: orderId,
      order_date: formattedDate,
      pickup_location: pickupLocation,
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: profile.address || "Unknown Address",
      billing_city: "Unknown City", // Should ideally be collected, assuming it's part of the address for now
      billing_pincode: profile.pincode,
      billing_state: profile.state,
      billing_country: "India",
      billing_email: profile.email || "noemail@example.com",
      billing_phone: profile.phone,
      shipping_is_billing: true,
      order_items: [
        {
          name: items || "Gita Gurukul Donation",
          sku: "GG-ITEM",
          units: 1,
          selling_price: amount,
        }
      ],
      payment_method: "Prepaid",
      sub_total: amount,
      length: length,
      breadth: breadth,
      height: height,
      weight: weight
    };

    const createRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderPayload),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      console.error("Shiprocket Create Order Error:", createData);
      return NextResponse.json({ error: "Failed to create Shiprocket order", details: createData }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      shipment_id: createData.shipment_id, 
      order_id: createData.order_id 
    }, { status: 200 });

  } catch (error) {
    console.error("Shiprocket API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
