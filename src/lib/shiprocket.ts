// Shiprocket Logistics Integration Helper

interface TokenCache {
  token: string | null;
  expiresAt: number;
}

const tokenCache: TokenCache = {
  token: null,
  expiresAt: 0,
};

/**
 * Retrieves a valid Shiprocket JWT token.
 * 1. Checks SHIPROCKET_API_TOKEN env var (static token if user generated one)
 * 2. Checks in-memory cache (valid for 10 days)
 * 3. Authenticates via /v1/external/auth/login using SHIPROCKET_EMAIL & SHIPROCKET_PASSWORD
 */
export async function getShiprocketToken(): Promise<{ token: string; source: string }> {
  // Option 1: Direct token in env
  const envToken = process.env.SHIPROCKET_API_TOKEN?.trim();
  if (envToken && envToken.length > 20) {
    return { token: envToken, source: "env_token" };
  }

  // Option 2: Cached token still valid
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now) {
    return { token: tokenCache.token, source: "memory_cache" };
  }

  // Option 3: Authenticate via login API
  const email = process.env.SHIPROCKET_EMAIL?.trim();
  let password = process.env.SHIPROCKET_PASSWORD?.trim();
  if (password && password.startsWith('"') && password.endsWith('"')) {
    password = password.slice(1, -1);
  }

  if (!email || !password) {
    throw new Error("Shiprocket credentials missing. Please configure SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD or SHIPROCKET_API_TOKEN.");
  }

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.token) {
    const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : "Authentication failed");
    if (res.status === 400 && String(errorMsg).includes("blocked")) {
      throw new Error(`Shiprocket Account Temporarily Blocked: ${errorMsg}. Please wait 15-30 mins, or set SHIPROCKET_API_TOKEN in settings.`);
    }
    throw new Error(`Shiprocket Auth Error (${res.status}): ${errorMsg}`);
  }

  // Cache token for 9 days (Shiprocket tokens expire in 10 days = 240 hours)
  tokenCache.token = data.token;
  tokenCache.expiresAt = now + 9 * 24 * 60 * 60 * 1000;

  return { token: data.token, source: "login_api" };
}

/**
 * Fetch all registered pickup locations from Shiprocket account
 */
export async function getPickupLocations(token: string) {
  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/settings/company/pickup", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.data?.shipping_address) {
      return data.data.shipping_address as Array<{
        id: number;
        pickup_location: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pin_code: string;
      }>;
    }
    return [];
  } catch (err) {
    console.warn("Failed to fetch pickup locations:", err);
    return [];
  }
}

/**
 * Determines the valid pickup location nickname.
 * Matches configured pickup nickname or picks the first active registered pickup location.
 */
export async function resolvePickupLocation(token: string): Promise<string> {
  const configured = (process.env.SHIPROCKET_PICKUP_LOCATION || "Primary").trim();
  
  // If user configured a short nickname, check or use it
  const locations = await getPickupLocations(token);
  if (locations.length > 0) {
    // Check if configured nickname matches any
    const match = locations.find(
      (loc) => loc.pickup_location.toLowerCase() === configured.toLowerCase()
    );
    if (match) return match.pickup_location;

    // If configured is full address or doesn't match, use the first valid registered pickup nickname!
    if (locations[0]?.pickup_location) {
      return locations[0].pickup_location;
    }
  }

  // Fallback to Primary if no locations fetched
  return configured.length > 30 ? "Primary" : configured;
}

export interface ShiprocketOrderPayload {
  orderId: string;
  amount: number;
  items: string;
  quantity?: number;
  profile: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

/**
 * Creates an adhoc shipment in Shiprocket
 */
export async function createShiprocketShipment(payload: ShiprocketOrderPayload) {
  const { token } = await getShiprocketToken();
  const pickupLocation = await resolvePickupLocation(token);

  const nameParts = (payload.profile?.name || "Customer").trim().split(" ");
  const firstName = nameParts[0] || "Valued";
  const lastName = nameParts.slice(1).join(" ") || "Customer";

  const now = new Date();
  const formattedDate = now.toISOString().replace(/T/, " ").replace(/\..+/, "").substring(0, 16);

  const units = payload.quantity || 1;
  const singleUnitPrice = Math.max(1, Math.round(payload.amount / units));

  // Diary package dimensions (cm & kg)
  const length = 22;
  const breadth = 16;
  const height = Math.max(3, 2 * units);
  const weight = Math.max(0.4, Number((0.45 * units).toFixed(2)));

  const fullAddress = payload.profile?.address || "Address Provided";
  const city = payload.profile?.city || "New Delhi";
  const state = payload.profile?.state || "Delhi";
  const pincode = payload.profile?.pincode || "110001";
  const phone = (payload.profile?.phone || "9999999999").replace(/\D/g, "").slice(-10);
  const email = payload.profile?.email || "customer@gitagurukul.com";

  const body = {
    order_id: payload.orderId,
    order_date: formattedDate,
    pickup_location: pickupLocation,
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: fullAddress,
    billing_address_2: "",
    billing_city: city,
    billing_pincode: pincode,
    billing_state: state,
    billing_country: "India",
    billing_email: email,
    billing_phone: phone,
    shipping_is_billing: true,
    order_items: [
      {
        name: payload.items || "Bhagavad Gita Diary",
        sku: "GG-DIARY-01",
        units: units,
        selling_price: singleUnitPrice,
        discount: 0,
        tax: 0,
      },
    ],
    payment_method: "Prepaid",
    sub_total: payload.amount,
    length: length,
    breadth: breadth,
    height: height,
    weight: weight,
  };

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.order_id) {
    const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : "Order creation failed in Shiprocket");
    throw new Error(`Shiprocket Create Order Failed: ${errorMsg}`);
  }

  return {
    success: true,
    order_id: data.order_id,
    shipment_id: data.shipment_id,
    awb_code: data.awb_code || null,
    courier_name: data.courier_name || null,
    status: data.status || "NEW",
    pickup_location: pickupLocation,
  };
}

/**
 * Live Tracking for AWB or Order ID
 */
export async function trackShipment(awbOrOrderId: string) {
  const { token } = await getShiprocketToken();
  const cleanId = encodeURIComponent(awbOrOrderId.trim());

  // Try AWB tracking first
  const awbRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${cleanId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const awbData = await awbRes.json().catch(() => ({}));

  if (awbRes.ok && awbData.tracking_data) {
    return { success: true, tracking: awbData.tracking_data };
  }

  // Fallback to order tracking
  const orderRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${cleanId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const orderData = await orderRes.json().catch(() => ({}));

  if (orderRes.ok && orderData.tracking_data) {
    return { success: true, tracking: orderData.tracking_data };
  }

  return { success: false, message: "No tracking details found yet for this ID." };
}

/**
 * Diagnostics Health Check
 */
export async function checkShiprocketHealth() {
  try {
    const { token, source } = await getShiprocketToken();
    const pickupLocations = await getPickupLocations(token);
    return {
      connected: true,
      tokenSource: source,
      pickupLocationsCount: pickupLocations.length,
      pickupLocations: pickupLocations.map((l) => ({
        nickname: l.pickup_location,
        city: l.city,
        state: l.state,
        pincode: l.pin_code,
      })),
      email: process.env.SHIPROCKET_EMAIL || "Not set",
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err.message || "Failed to connect to Shiprocket",
      email: process.env.SHIPROCKET_EMAIL || "Not set",
    };
  }
}

/**
 * Cancels an order in Shiprocket
 */
export async function cancelShiprocketOrder(shiprocketOrderId: number | string) {
  try {
    const { token } = await getShiprocketToken();
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids: [shiprocketOrderId] }),
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data };
  } catch (err: any) {
    console.warn("Failed to cancel in Shiprocket:", err);
    return { success: false, error: err.message };
  }
}
