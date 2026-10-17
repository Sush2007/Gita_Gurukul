import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const DEFAULT_SETTINGS = {
  price: 799,
  original_price: 999,
  in_stock: true,
  stock_badge: "In Stock",
  dispatch_time: "24-48 hours",
  dispatch_days: "Mon - Sat",
  cutoff_time: "2:00 PM",
  announcement_enabled: false,
  announcement_text: "Special Gita Jayanti Edition — Free Delivery Across India",
};

const settingsFilePath = path.join(process.cwd(), "src", "data", "settings.json");

function getLocalSettings() {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveLocalSettings(data: any) {
  try {
    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(settingsFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    // ignore
  }
}

export async function GET() {
  try {
    // Try fetching from Supabase first
    const { data, error } = await supabaseAdmin
      .from("store_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (!error && data) {
      return NextResponse.json({ success: true, settings: data });
    }

    // Fallback to local file
    const local = getLocalSettings();
    return NextResponse.json({ success: true, settings: local });
  } catch (error: any) {
    const local = getLocalSettings();
    return NextResponse.json({ success: true, settings: local });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mergedSettings = {
      ...DEFAULT_SETTINGS,
      ...getLocalSettings(),
      ...body,
      id: "default",
      updated_at: new Date().toISOString(),
    };

    // Save to local fallback file
    saveLocalSettings(mergedSettings);

    // Save to Supabase store_settings table
    try {
      await supabaseAdmin.from("store_settings").upsert(mergedSettings);
    } catch (dbErr) {
      console.warn("Could not upsert to store_settings table in Supabase:", dbErr);
    }

    return NextResponse.json({ success: true, settings: mergedSettings });
  } catch (error: any) {
    console.error("Error saving store settings:", error);
    return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 500 });
  }
}
