"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Package,
  IndianRupee,
  Heart,
  Truck,
  RefreshCw,
  Search,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  Lock,
  LogOut,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  Send,
  Eye,
  EyeOff,
  Radio,
  Sliders,
  Calendar,
  Megaphone,
  Save,
  Tag,
  Sparkles,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface StoreSettings {
  price: number;
  original_price: number;
  in_stock: boolean;
  stock_badge: string;
  dispatch_time: string;
  dispatch_days: string;
  cutoff_time: string;
  announcement_enabled: boolean;
  announcement_text: string;
}

interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode: string;
}

interface ShiprocketDetails {
  status: string;
  shipment_id?: number | string | null;
  order_id?: number | string | null;
  awb_code?: string | null;
  courier_name?: string | null;
  pickup_location?: string;
  error?: string | null;
  updated_at?: string;
}

interface OrderRecord {
  id: string;
  order_id: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  amount: number;
  items: string;
  quantity?: number;
  type?: "order" | "donation";
  donor_name?: string;
  donor_message?: string;
  customer?: OrderCustomer;
  payment_status?: string;
  order_status?: string;
  status?: string;
  shiprocket?: ShiprocketDetails;
  created_at?: string;
  date?: any;
}

interface ShiprocketHealth {
  connected: boolean;
  tokenSource?: string;
  pickupLocationsCount?: number;
  pickupLocations?: Array<{
    nickname: string;
    city: string;
    state: string;
    pincode: string;
  }>;
  email?: string;
  error?: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<"orders" | "donations" | "shiprocket" | "settings">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Store & Dispatch Settings State
  const [settings, setSettings] = useState<StoreSettings>({
    price: 799,
    original_price: 999,
    in_stock: true,
    stock_badge: "In Stock",
    dispatch_time: "24-48 hours",
    dispatch_days: "Mon - Sat",
    cutoff_time: "2:00 PM",
    announcement_enabled: false,
    announcement_text: "Special Gita Jayanti Edition — Free Delivery Across India",
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Shiprocket Diagnostic State
  const [shiprocketHealth, setShiprocketHealth] = useState<ShiprocketHealth | null>(null);
  const [checkingShiprocket, setCheckingShiprocket] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Live Token Tester State
  const [testTokenInput, setTestTokenInput] = useState("");
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [tokenTestMessage, setTokenTestMessage] = useState<string | null>(null);

  // Loading indicator for action buttons
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);

  // Check existing session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("gg_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data?.settings) {
        setSettings({
          price: Number(data.settings.price) || 799,
          original_price: Number(data.settings.original_price) || 999,
          in_stock: data.settings.in_stock ?? true,
          stock_badge: data.settings.stock_badge || "In Stock",
          dispatch_time: data.settings.dispatch_time || "24-48 hours",
          dispatch_days: data.settings.dispatch_days || "Mon - Sat",
          cutoff_time: data.settings.cutoff_time || "2:00 PM",
          announcement_enabled: Boolean(data.settings.announcement_enabled),
          announcement_text: data.settings.announcement_text || "Special Gita Jayanti Edition — Free Delivery Across India",
        });
      }
    } catch (err: any) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Store & Dispatch settings saved successfully!");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error while saving settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Fetch settings on login or auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch orders error:", error);
        setLoadingOrders(false);
        setDbError(error.message);
      } else {
        setOrders(data as OrderRecord[]);
        setLoadingOrders(false);
        setDbError(null);
      }
    } catch (err: any) {
      console.error("Error connecting to Supabase:", err);
      setLoadingOrders(false);
      setDbError(err.message || "Error connecting to Supabase database");
    }
  };

  // Subscribe to Supabase orders table with Postgres Realtime
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoadingOrders(true);
    fetchOrders();

    const channel = supabase
      .channel("admin-orders-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Load Shiprocket health on tab change
  useEffect(() => {
    if (isAuthenticated && activeTab === "shiprocket" && !shiprocketHealth) {
      fetchShiprocketHealth();
    }
  }, [isAuthenticated, activeTab, shiprocketHealth]);

  const fetchShiprocketHealth = async () => {
    setCheckingShiprocket(true);
    try {
      const res = await fetch("/api/shiprocket/status");
      const data = await res.json();
      setShiprocketHealth(data);
    } catch (err: any) {
      setShiprocketHealth({ connected: false, error: err.message });
    } finally {
      setCheckingShiprocket(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setVerifying(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("gg_admin_auth", "true");
        toast.success("Welcome to Gita Gurukul Dashboard");
      } else {
        toast.error(data.error || "Invalid Passcode");
      }
    } catch {
      toast.error("Failed to authenticate");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("gg_admin_auth");
    setIsAuthenticated(false);
    setPasscode("");
  };

  // Push to Shiprocket Action
  const handlePushToShiprocket = async (order: OrderRecord) => {
    setActionLoadingId(order.id);
    const toastId = toast.loading("Sending order to Shiprocket...");
    try {
      const res = await fetch("/api/shiprocket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.order_id || order.id,
          amount: order.amount,
          items: order.items,
          quantity: order.quantity || 1,
          profile: order.customer || {},
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Shiprocket Order Created! Shipment #${data.shipment_id}`, { id: toastId });
      } else {
        toast.error(data.error || "Failed to create shipment in Shiprocket", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Network error", { id: toastId });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Sync tracking for a single order from Shiprocket
  const handleSyncSingleTracking = async (orderId: string) => {
    setActionLoadingId(orderId);
    const toastId = toast.loading("Checking live courier tracking with Shiprocket...");
    try {
      const res = await fetch("/api/shiprocket/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Tracking synced: Status is ${data.status}`, { id: toastId });
        fetchOrders();
      } else {
        toast.error(data.message || "No tracking updates from courier yet", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sync tracking", { id: toastId });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Sync tracking for all active orders
  const handleSyncAllTracking = async () => {
    setSyncingAll(true);
    const toastId = toast.loading("Syncing all active shipments with Shiprocket...");
    try {
      const res = await fetch("/api/shiprocket/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Synced tracking for ${data.updatedCount || 0} orders!`, { id: toastId });
        fetchOrders();
      } else {
        toast.error(data.error || "Failed to sync tracking", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Sync error", { id: toastId });
    } finally {
      setSyncingAll(false);
    }
  };

  // Update Status Manually
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          order_status: newStatus,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch (err: any) {
      console.error("Failed to update status in Supabase:", err);
      toast.error("Failed to update status");
    }
  };

  // Live Track Package
  const handleTrackPackage = async (awbOrOrderId: string) => {
    if (!awbOrOrderId) return;
    setTrackingLoading(true);
    setTrackingResult(null);
    try {
      const res = await fetch("/api/shiprocket/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: awbOrOrderId }),
      });
      const data = await res.json();
      setTrackingResult(data);
      if (!res.ok || !data.success) {
        toast.error(data.message || "No tracking found yet");
      }
    } catch (err: any) {
      toast.error(err.message || "Error tracking package");
    } finally {
      setTrackingLoading(false);
    }
  };

  // Verify custom Shiprocket token
  const handleVerifyCustomToken = async () => {
    if (!testTokenInput.trim()) {
      toast.error("Please enter a Shiprocket API token or password to test");
      return;
    }
    setVerifyingToken(true);
    setTokenTestMessage(null);
    try {
      const res = await fetch("/api/shiprocket/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: testTokenInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.connected) {
        setTokenTestMessage(`✓ Valid! Successfully connected to Shiprocket. Detected ${data.pickupLocationsCount} pickup locations.`);
        toast.success("Shiprocket token verified!");
        fetchShiprocketHealth();
      } else {
        setTokenTestMessage(`✕ Verification Failed: ${data.error || "Token invalid"}`);
        toast.error(data.error || "Invalid token");
      }
    } catch (err: any) {
      setTokenTestMessage(`✕ Error: ${err.message}`);
    } finally {
      setVerifyingToken(false);
    }
  };

  // Printable Slip
  const handlePrintSlip = (order: OrderRecord) => {
    const slipWindow = window.open("", "_blank", "width=600,height=700");
    if (!slipWindow) return;

    slipWindow.document.write(`
      <html>
        <head>
          <title>Packing Slip - ${order.order_id || order.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #112113; line-height: 1.5; }
            .header { border-bottom: 2px solid #D98A36; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #112113; }
            .badge { background: #f0fdf4; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .section { margin-bottom: 20px; }
            .section h4 { margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px; }
            .box { background: #fdfbf7; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .total { font-size: 18px; font-weight: bold; color: #D98A36; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">GITA GURUKUL - PACKING SLIP</div>
            <div>Order ID: <strong>${order.order_id || order.id}</strong></div>
            <div>Date: ${order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recent"}</div>
            <div>Payment: <span class="badge">PREPAID - ${order.razorpay_payment_id || "PAID"}</span></div>
          </div>
          
          <div class="section">
            <h4>SHIP TO CUSTOMER</h4>
            <div class="box">
              <strong>${order.customer?.name || "Customer"}</strong><br/>
              Phone: ${order.customer?.phone || "N/A"}<br/>
              Email: ${order.customer?.email || "N/A"}<br/>
              ${order.customer?.address || "Address"}<br/>
              ${order.customer?.city ? order.customer.city + ", " : ""}${order.customer?.state || ""}, PIN: ${order.customer?.pincode || ""}
            </div>
          </div>

          <div class="section">
            <h4>ORDER DETAILS</h4>
            <div class="box">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${order.items || "Bhagavad Gita Diary"}</td>
                    <td>${order.quantity || 1}</td>
                    <td>₹${order.amount}</td>
                  </tr>
                </tbody>
              </table>
              <div class="total" style="margin-top: 15px;">Total Paid: ₹${order.amount}</div>
            </div>
          </div>

          ${
            order.shiprocket?.shipment_id
              ? `<div class="section"><h4>SHIPROCKET LOGISTICS</h4><div class="box">Shipment ID: ${order.shiprocket.shipment_id}<br/>Courier AWB: ${order.shiprocket.awb_code || "Generated at pickup"}</div></div>`
              : ""
          }

          <div style="text-align: center; margin-top: 40px; color: #9ca3af; font-size: 12px;">
            Thank you for supporting Gita Gurukul | Spread the Wisdom
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    slipWindow.document.close();
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Type",
      "Customer Name",
      "Phone",
      "Email",
      "Address",
      "City",
      "State",
      "Pincode",
      "Items",
      "Quantity",
      "Amount (INR)",
      "Payment ID",
      "Order Status",
      "Shiprocket Status",
      "Shiprocket Shipment ID",
      "AWB Code",
    ];

    const rows = orders.map((o) => [
      `"${o.order_id || o.id}"`,
      `"${o.created_at ? new Date(o.created_at).toLocaleString() : ""}"`,
      `"${o.type || "order"}"`,
      `"${(o.customer?.name || o.donor_name || "").replace(/"/g, '""')}"`,
      `"${o.customer?.phone || ""}"`,
      `"${o.customer?.email || ""}"`,
      `"${(o.customer?.address || "").replace(/"/g, '""')}"`,
      `"${o.customer?.city || ""}"`,
      `"${o.customer?.state || ""}"`,
      `"${o.customer?.pincode || ""}"`,
      `"${(o.items || "").replace(/"/g, '""')}"`,
      `"${o.quantity || 1}"`,
      `"${o.amount}"`,
      `"${o.razorpay_payment_id || ""}"`,
      `"${o.order_status || o.status || "Processing"}"`,
      `"${o.shiprocket?.status || "Pending"}"`,
      `"${o.shiprocket?.shipment_id || ""}"`,
      `"${o.shiprocket?.awb_code || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gita_gurukul_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV!");
  };

  // Metrics
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let storeOrdersCount = 0;
    let diariesSold = 0;
    let totalDonations = 0;

    orders.forEach((o) => {
      const amt = Number(o.amount) || 0;
      totalRevenue += amt;

      if (o.type === "donation" || o.donor_name) {
        totalDonations += amt;
      } else {
        storeOrdersCount += 1;
        diariesSold += Number(o.quantity) || 1;
      }
    });

    return { totalRevenue, storeOrdersCount, diariesSold, totalDonations };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      const isDonation = o.type === "donation" || Boolean(o.donor_name);
      if (activeTab === "orders" && isDonation) return false;
      if (activeTab === "donations" && !isDonation) return false;

      // Status filter
      if (statusFilter !== "ALL") {
        const currStatus = (o.order_status || o.status || "processing").toUpperCase();
        const srStatus = (o.shiprocket?.status || "pending").toUpperCase();
        if (statusFilter === "PROCESSING" && currStatus !== "PROCESSING") return false;
        if (statusFilter === "SHIPPED" && currStatus !== "SHIPPED") return false;
        if (statusFilter === "DELIVERED" && currStatus !== "DELIVERED") return false;
        if (statusFilter === "SR_FAILED" && srStatus !== "FAILED") return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = (o.order_id || o.id || "").toLowerCase().includes(q);
        const nameMatch = (o.customer?.name || o.donor_name || "").toLowerCase().includes(q);
        const phoneMatch = (o.customer?.phone || "").toLowerCase().includes(q);
        const emailMatch = (o.customer?.email || "").toLowerCase().includes(q);
        const cityMatch = (o.customer?.city || "").toLowerCase().includes(q);
        if (!idMatch && !nameMatch && !phoneMatch && !emailMatch && !cityMatch) return false;
      }

      return true;
    });
  }, [orders, activeTab, statusFilter, searchQuery]);

  // Passcode Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <Toaster position="top-center" />
        <div className="max-w-md w-full bg-[#FAF7F2] border border-brand-primary/20 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-6 border border-brand-primary/20">
            <Lock size={32} />
          </div>

          <h1 className="font-display font-normal text-2xl text-brand-dark mb-2 text-center">Gita Gurukul Admin</h1>
          <p className="font-body font-semibold text-gray-600 text-sm mb-6 text-center">
            Enter passcode to manage store orders and Shiprocket logistics.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <input
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Admin Passcode"
                className="w-full border border-gray-200 bg-white rounded-xl p-3.5 pr-12 font-body font-semibold text-brand-dark focus:outline-brand-primary text-sm shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
              >
                {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-brand-primary text-white font-button font-bold text-base py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(226,154,44,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {verifying ? <RefreshCw className="animate-spin" size={18} /> : "Unlock Dashboard"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-xs font-body font-semibold text-gray-400 hover:text-brand-primary transition-colors">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-brand-dark flex flex-col pt-8 md:pt-10 pb-16">
      <Toaster position="top-center" />

      {/* Main Container */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-[60px]">
        {/* TOP BAR / HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-brand-primary/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display font-normal text-3xl lg:text-4xl text-brand-dark">Store Operations</h1>
              <span className="flex items-center gap-1.5 bg-[#f0fdf4] text-[#166534] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#bbf7d0]">
                <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse"></span> Live Sync
              </span>
            </div>
            <p className="font-body font-semibold text-gray-600 text-sm mt-1">
              Real-time monitoring of Bhagavad Gita Diary orders, payments, and Shiprocket courier fulfillment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="bg-white border border-brand-primary/20 hover:border-brand-primary text-brand-dark font-body font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>

            <button
              onClick={handleSyncAllTracking}
              disabled={syncingAll}
              className="bg-white border border-brand-primary/20 hover:border-brand-primary text-brand-dark font-body font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
              title="Sync latest courier tracking for all active shipments from Shiprocket"
            >
              <RefreshCw size={16} className={syncingAll ? "animate-spin" : ""} />
              Sync Tracking
            </button>

            <button
              onClick={() => {
                fetchOrders();
                toast.success("Refreshed live orders!");
              }}
              className="bg-white border border-brand-primary/20 hover:border-brand-primary text-brand-dark font-body font-semibold text-sm p-2.5 rounded-xl shadow-sm transition-all"
              title="Refresh Orders"
            >
              <RefreshCw size={16} />
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-body font-semibold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* METRICS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 my-8">
          {/* Revenue */}
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body font-semibold text-xs text-gray-500 uppercase tracking-wider">Total Revenue</span>
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <IndianRupee size={20} />
              </div>
            </div>
            <div className="font-display font-normal text-3xl text-brand-dark">₹{metrics.totalRevenue.toLocaleString()}</div>
            <p className="font-body font-semibold text-xs text-gray-500 mt-2">Combined orders & donations</p>
          </div>

          {/* Diary Orders */}
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body font-semibold text-xs text-gray-500 uppercase tracking-wider">Store Orders</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package size={20} />
              </div>
            </div>
            <div className="font-display font-normal text-3xl text-brand-dark">{metrics.storeOrdersCount}</div>
            <p className="font-body font-semibold text-xs text-gray-500 mt-2">Paid customer orders</p>
          </div>

          {/* Books Sold */}
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body font-semibold text-xs text-gray-500 uppercase tracking-wider">Diaries Sold</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Truck size={20} />
              </div>
            </div>
            <div className="font-display font-normal text-3xl text-brand-dark">{metrics.diariesSold} units</div>
            <p className="font-body font-semibold text-xs text-gray-500 mt-2">Physical diaries to ship</p>
          </div>

          {/* Donations */}
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body font-semibold text-xs text-gray-500 uppercase tracking-wider">Donations</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Heart size={20} />
              </div>
            </div>
            <div className="font-display font-normal text-3xl text-brand-dark">₹{metrics.totalDonations.toLocaleString()}</div>
            <p className="font-body font-semibold text-xs text-gray-500 mt-2">Gurukul patron contributions</p>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-brand-primary/15 mb-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("orders")}
            className={`font-body font-semibold text-sm pb-3 px-4 border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "orders"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-gray-500 hover:text-brand-dark"
            }`}
          >
            <Package size={18} />
            Orders & Shipping
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
              {metrics.storeOrdersCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("donations")}
            className={`font-body font-semibold text-sm pb-3 px-4 border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "donations"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-gray-500 hover:text-brand-dark"
            }`}
          >
            <Heart size={18} />
            Donations
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
              {orders.filter((o) => o.type === "donation" || Boolean(o.donor_name)).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("shiprocket")}
            className={`font-body font-semibold text-sm pb-3 px-4 border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "shiprocket"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-gray-500 hover:text-brand-dark"
            }`}
          >
            <Truck size={18} />
            Shiprocket Center
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`font-body font-semibold text-sm pb-3 px-4 border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "settings"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-gray-500 hover:text-brand-dark"
            }`}
          >
            <Sliders size={18} />
            Store & Dispatch Settings
          </button>
        </div>

        {/* TAB 1 & 2: ORDERS OR DONATIONS VIEW */}
        {(activeTab === "orders" || activeTab === "donations") && (
          <div className="space-y-6">
            {/* SEARCH AND FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#FAF7F2] p-4 rounded-2xl border border-brand-primary/10">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, email, order ID, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white font-body font-semibold text-sm focus:outline-brand-primary shadow-sm"
                />
              </div>

              {activeTab === "orders" && (
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 bg-white font-body font-semibold text-sm rounded-xl px-3 py-2.5 focus:outline-brand-primary shadow-sm"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="SR_FAILED">Shiprocket Failed</option>
                  </select>
                </div>
              )}
            </div>

            {/* SUPABASE SETUP NOTICE BANNER */}
            {dbError && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm animate-in fade-in">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={22} />
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-body font-bold text-sm text-amber-900">
                        Supabase Database Setup Required
                      </h4>
                      <span className="text-[11px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold self-start sm:self-auto">
                        table-setup-needed
                      </span>
                    </div>
                    <p className="font-body font-semibold text-xs text-amber-800 leading-relaxed">
                      Your Supabase connection is active, but the <code>orders</code> and <code>profiles</code> tables have not been created yet in Postgres.
                      To activate live orders, open{" "}
                      <a
                        href="https://supabase.com/dashboard/project/qveazfhqgsiqurzlbkvr/sql/new"
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-bold hover:text-amber-950 inline-flex items-center gap-1"
                      >
                        Supabase SQL Editor <ExternalLink size={12} />
                      </a>{" "}
                      and execute <code>supabase_schema.sql</code> (saved in your project root).
                    </p>
                    <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300/50 font-mono text-xs text-amber-950 overflow-x-auto">
                      Database status: {dbError}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS LIST */}
            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#FAF7F2] rounded-3xl border border-brand-primary/10">
                <RefreshCw size={32} className="animate-spin text-brand-primary mb-3" />
                <p className="font-body font-semibold text-gray-600">Loading orders from database...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-[#FAF7F2] rounded-3xl border border-brand-primary/10">
                <Package size={40} className="mx-auto text-gray-400 mb-3" />
                <h3 className="font-display font-normal text-xl text-brand-dark">No orders found</h3>
                <p className="font-body font-semibold text-gray-500 text-sm mt-1">
                  {searchQuery ? "Try refining your search terms." : "Orders will automatically appear here as customers purchase."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const isDonation = order.type === "donation" || Boolean(order.donor_name);
                  const isShiprocketCreated = order.shiprocket?.status === "Created";
                  const isShiprocketFailed = order.shiprocket?.status === "Failed";

                  return (
                    <div
                      key={order.id}
                      className="bg-[#FAF7F2] border border-brand-primary/15 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden transition-all hover:border-brand-primary/30"
                    >
                      {/* CARD SUMMARY HEADER */}
                      <div className="p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-normal text-lg text-brand-dark">
                              {order.order_id || order.id}
                            </span>

                            {/* Payment Badge */}
                            <span className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle size={12} /> Paid ₹{order.amount}
                            </span>

                            {/* Order Status Badge */}
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                              {order.order_status || order.status || "Processing"}
                            </span>

                            {/* Shiprocket Badge for physical orders */}
                            {!isDonation && (
                              <span
                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${
                                  isShiprocketCreated
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : isShiprocketFailed
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                <Truck size={12} />
                                {isShiprocketCreated
                                  ? `Shiprocket #${order.shiprocket?.shipment_id}`
                                  : isShiprocketFailed
                                  ? "Shiprocket: Failed"
                                  : "Shiprocket: Pending"}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body font-semibold text-xs text-gray-600">
                            <span>
                              <strong>Customer:</strong> {order.customer?.name || order.donor_name || "Guest"}
                            </span>
                            {order.customer?.phone && (
                              <span>
                                <strong>Phone:</strong> {order.customer.phone}
                              </span>
                            )}
                            {order.customer?.city && (
                              <span>
                                <strong>City:</strong> {order.customer.city}, {order.customer.state}
                              </span>
                            )}
                            <span>
                              <strong>Items:</strong> {order.items}
                            </span>
                            <span className="text-gray-400">
                              {order.created_at ? new Date(order.created_at).toLocaleString() : ""}
                            </span>
                          </div>
                        </div>

                        {/* QUICK ACTIONS BUTTONS */}
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start sm:justify-end">
                          {/* Push to Shiprocket Button (if not yet pushed or failed) */}
                          {!isDonation && (!isShiprocketCreated || isShiprocketFailed) && (
                            <button
                              onClick={() => handlePushToShiprocket(order)}
                              disabled={actionLoadingId === order.id}
                              className="bg-brand-primary text-white font-body font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
                            >
                              {actionLoadingId === order.id ? (
                                <RefreshCw size={14} className="animate-spin" />
                              ) : (
                                <Send size={14} />
                              )}
                              Push to Shiprocket
                            </button>
                          )}

                          {/* Sync Tracking Button */}
                          {!isDonation && isShiprocketCreated && (
                            <button
                              onClick={() => handleSyncSingleTracking(order.id)}
                              disabled={actionLoadingId === order.id}
                              className="bg-white border border-blue-200 hover:border-blue-400 text-blue-700 font-body font-semibold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                              title="Sync tracking status from Shiprocket"
                            >
                              <RefreshCw size={14} className={actionLoadingId === order.id ? "animate-spin" : ""} />
                              Sync Tracking
                            </button>
                          )}

                          {/* Print Packing Slip */}
                          {!isDonation && (
                            <button
                              onClick={() => handlePrintSlip(order)}
                              className="bg-white border border-gray-200 hover:border-brand-primary text-brand-dark font-body font-semibold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                              title="Print Packing Slip"
                            >
                              <Printer size={14} /> Slip
                            </button>
                          )}

                          {/* Expand Details Toggle */}
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="bg-white border border-gray-200 hover:border-brand-primary text-brand-dark font-body font-semibold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                          >
                            {isExpanded ? "Hide Details" : "View Details"}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* EXPANDABLE DETAILS DRAWER */}
                      {isExpanded && (
                        <div className="border-t border-brand-primary/10 bg-white p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Customer & Shipping Address */}
                            <div className="space-y-2 border border-gray-100 rounded-xl p-4 bg-[#FDFBF7]">
                              <h4 className="font-body font-semibold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <MapPin size={14} className="text-brand-primary" /> Delivery Address
                              </h4>
                              <p className="font-body font-semibold text-sm text-brand-dark">
                                {order.customer?.name || order.donor_name || "Customer"}
                              </p>
                              <p className="font-body font-semibold text-xs text-gray-600 leading-relaxed">
                                {order.customer?.address || "No street address provided"}
                                <br />
                                {order.customer?.city ? `${order.customer.city}, ` : ""}
                                {order.customer?.state ? `${order.customer.state} - ` : ""}
                                <strong>{order.customer?.pincode || ""}</strong>
                              </p>
                              <div className="pt-2 border-t border-gray-200/60 flex flex-col gap-1 text-xs font-body font-semibold">
                                {order.customer?.phone && (
                                  <a
                                    href={`https://wa.me/91${order.customer.phone.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-700 hover:underline flex items-center gap-1"
                                  >
                                    <Phone size={12} /> {order.customer.phone} (WhatsApp)
                                  </a>
                                )}
                                {order.customer?.email && (
                                  <a href={`mailto:${order.customer.email}`} className="text-gray-600 hover:underline flex items-center gap-1">
                                    <Mail size={12} /> {order.customer.email}
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Order & Payment Information */}
                            <div className="space-y-2 border border-gray-100 rounded-xl p-4 bg-[#FDFBF7]">
                              <h4 className="font-body font-semibold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <CheckCircle size={14} className="text-emerald-600" /> Payment & Item Specs
                              </h4>
                              <div className="text-xs font-body font-semibold space-y-1.5 text-gray-700">
                                <div>
                                  <span className="text-gray-400">Item:</span> {order.items}
                                </div>
                                <div>
                                  <span className="text-gray-400">Quantity:</span> {order.quantity || 1} units
                                </div>
                                <div>
                                  <span className="text-gray-400">Total Paid:</span>{" "}
                                  <strong className="text-brand-primary text-sm">₹{order.amount}</strong>
                                </div>
                                <div>
                                  <span className="text-gray-400">Razorpay Payment ID:</span>
                                  <br />
                                  <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">
                                    {order.razorpay_payment_id || "Direct"}
                                  </code>
                                </div>
                                {order.donor_message && (
                                  <div className="pt-2 border-t border-gray-200">
                                    <span className="text-gray-400">Donor Message:</span>
                                    <p className="italic text-gray-800 mt-0.5">"{order.donor_message}"</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Shiprocket Fulfillment Controls */}
                            <div className="space-y-3 border border-gray-100 rounded-xl p-4 bg-[#FDFBF7]">
                              <h4 className="font-body font-semibold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <Truck size={14} className="text-blue-600" /> Logistics Status
                              </h4>

                              {isDonation ? (
                                <p className="font-body font-semibold text-xs text-gray-500">
                                  This is a Gurukul donation. Physical shipping is not required.
                                </p>
                              ) : (
                                <div className="space-y-2 text-xs font-body font-semibold">
                                  <div>
                                    <span className="text-gray-400">Shiprocket Status:</span>{" "}
                                    <strong
                                      className={
                                        isShiprocketCreated
                                          ? "text-blue-700"
                                          : isShiprocketFailed
                                          ? "text-red-600"
                                          : "text-amber-700"
                                      }
                                    >
                                      {order.shiprocket?.status || "Pending"}
                                    </strong>
                                  </div>

                                  {order.shiprocket?.shipment_id && (
                                    <div>
                                      <span className="text-gray-400">Shipment ID:</span> {order.shiprocket.shipment_id}
                                    </div>
                                  )}

                                  {order.shiprocket?.awb_code && (
                                    <div>
                                      <span className="text-gray-400">AWB Code:</span> {order.shiprocket.awb_code}
                                    </div>
                                  )}

                                  {order.shiprocket?.error && (
                                    <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-[11px] leading-tight">
                                      <strong>Notice:</strong> {order.shiprocket.error}
                                    </div>
                                  )}

                                  {/* Update Status Dropdown */}
                                  <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                                    <span className="text-gray-500 text-xs">Set Status:</span>
                                    <select
                                      defaultValue={order.order_status || order.status || "Processing"}
                                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                      className="border border-gray-300 rounded px-2 py-1 text-xs font-body font-semibold bg-white"
                                    >
                                      <option value="Processing">Processing</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHIPROCKET CENTER */}
        {activeTab === "shiprocket" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* CONNECTION STATUS & DIAGNOSTICS */}
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-brand-primary/10">
                <div>
                  <h3 className="font-display font-normal text-2xl text-brand-dark">Shiprocket Connection Status</h3>
                  <p className="font-body font-semibold text-xs text-gray-500 mt-1">
                    Live connection diagnostic and courier configuration
                  </p>
                </div>

                <button
                  onClick={fetchShiprocketHealth}
                  disabled={checkingShiprocket}
                  className="bg-brand-primary text-white font-body font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={16} className={checkingShiprocket ? "animate-spin" : ""} />
                  Test Connection Live
                </button>
              </div>

              {checkingShiprocket ? (
                <div className="flex items-center gap-3 py-6 text-gray-600 font-body font-semibold text-sm">
                  <RefreshCw className="animate-spin text-brand-primary" size={20} />
                  Checking credentials with Shiprocket server...
                </div>
              ) : shiprocketHealth ? (
                <div className="space-y-6">
                  {/* Status Indicator Banner */}
                  <div
                    className={`p-4 rounded-xl border flex items-center gap-3 ${
                      shiprocketHealth.connected
                        ? "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {shiprocketHealth.connected ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    <div>
                      <h4 className="font-body font-bold text-sm">
                        {shiprocketHealth.connected ? "Shiprocket Connected & Operational" : "Shiprocket Notice / Action Needed"}
                      </h4>
                      <p className="font-body font-semibold text-xs mt-0.5">
                        {shiprocketHealth.connected
                          ? `Ready to generate automated labels and dispatch courier pickups. Registered pickup points: ${shiprocketHealth.pickupLocationsCount}`
                          : shiprocketHealth.error || "Unable to authenticate with Shiprocket"}
                      </p>
                    </div>
                  </div>

                  {/* Registered Pickup Points */}
                  {shiprocketHealth.pickupLocations && shiprocketHealth.pickupLocations.length > 0 && (
                    <div>
                      <h4 className="font-body font-semibold text-sm text-brand-dark mb-3">
                        Registered Pickup Locations in Shiprocket:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shiprocketHealth.pickupLocations.map((loc, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin size={16} className="text-brand-primary" />
                              <strong className="font-display font-normal text-base text-brand-dark">
                                {loc.nickname}
                              </strong>
                              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                ACTIVE
                              </span>
                            </div>
                            <p className="font-body font-semibold text-xs text-gray-600">
                              {loc.city}, {loc.state} - {loc.pincode}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* AWB LIVE PACKAGE TRACKER TOOL */}
            <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-3xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <h3 className="font-display font-normal text-2xl text-brand-dark mb-2">Live Package Tracker</h3>
              <p className="font-body font-semibold text-xs text-gray-500 mb-6">
                Enter any Shiprocket AWB Number or Order ID to inspect live courier progress.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="text"
                  placeholder="Enter AWB or Order ID..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="flex-1 border border-gray-200 bg-white rounded-xl p-3 font-body font-semibold text-sm focus:outline-brand-primary shadow-sm"
                />
                <button
                  onClick={() => handleTrackPackage(trackingInput)}
                  disabled={trackingLoading || !trackingInput.trim()}
                  className="bg-brand-primary text-white font-body font-semibold text-sm px-6 py-3 rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {trackingLoading ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
                  Track
                </button>
              </div>

              {/* Tracking Result View */}
              {trackingResult && (
                <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-white font-body font-semibold text-xs max-w-xl">
                  {trackingResult.success ? (
                    <div>
                      <h4 className="text-brand-primary font-bold text-sm mb-2">Live Status:</h4>
                      <pre className="bg-gray-50 p-3 rounded overflow-x-auto text-gray-800 text-[11px]">
                        {JSON.stringify(trackingResult.tracking, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">{trackingResult.message || "No tracking found."}</div>
                  )}
                </div>
              )}
            </div>

            {/* SHIPROCKET CREDENTIALS & TOKEN TESTER */}
            <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-3xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-4">
              <div>
                <h3 className="font-display font-normal text-2xl text-brand-dark mb-1">Verify Shiprocket API Token</h3>
                <p className="font-body font-semibold text-xs text-gray-500">
                  If your account is temporarily blocked due to failed logins or password changes, generating an API token bypasses all rate limits.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs font-body font-semibold text-gray-700 space-y-2 max-w-2xl">
                <strong className="text-brand-dark">How to obtain a permanent Shiprocket API Token:</strong>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 pl-1">
                  <li>Log in to your Shiprocket account at <a href="https://app.shiprocket.in" target="_blank" rel="noreferrer" className="text-brand-primary underline">app.shiprocket.in</a></li>
                  <li>Navigate to <strong>Settings &gt; API &gt; Configure</strong></li>
                  <li>Click <strong>Generate Token</strong> or add an API user with full permissions</li>
                  <li>Paste the token below to test it, and save it to <code>.env.local</code> as <code>SHIPROCKET_API_TOKEN</code></li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="text"
                  placeholder="Paste Shiprocket API Token..."
                  value={testTokenInput}
                  onChange={(e) => setTestTokenInput(e.target.value)}
                  className="flex-1 border border-gray-200 bg-white rounded-xl p-3 font-body font-semibold text-xs focus:outline-brand-primary shadow-sm"
                />
                <button
                  onClick={handleVerifyCustomToken}
                  disabled={verifyingToken || !testTokenInput.trim()}
                  className="bg-brand-primary text-white font-body font-semibold text-sm px-6 py-3 rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {verifyingToken ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                  Verify Token
                </button>
              </div>

              {tokenTestMessage && (
                <div className={`p-3 rounded-xl text-xs font-body font-semibold max-w-xl ${
                  tokenTestMessage.startsWith("✓") ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {tokenTestMessage}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STORE & DISPATCH SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* TOP SETTINGS HEADER WITH ACTION BAR */}
            <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-3xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20">
                    <Sliders size={24} />
                  </div>
                  <div>
                    <h2 className="font-display font-normal text-3xl text-brand-dark">Store &amp; Dispatch Controls</h2>
                    <p className="font-body font-semibold text-xs text-gray-500 mt-0.5">
                      Everyday management for dispatch schedules, daily cutoffs, pricing, inventory stock, and top announcements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-stretch md:self-auto">
                <button
                  type="button"
                  onClick={fetchSettings}
                  disabled={loadingSettings}
                  className="bg-white border border-brand-primary/20 hover:border-brand-primary text-brand-dark font-body font-semibold text-sm px-4 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  title="Reload settings from database"
                >
                  <RefreshCw size={16} className={loadingSettings ? "animate-spin" : ""} />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={savingSettings}
                  className="flex-1 md:flex-initial bg-brand-primary text-white font-body font-semibold text-sm px-6 py-3 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(226,154,44,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingSettings ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                  Save All Changes
                </button>
              </div>
            </div>

            {/* TWO-COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SECTION 1: PICKUP & DISPATCH SCHEDULE */}
              <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-3xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-brand-primary/10">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-normal text-xl text-brand-dark">Pickup &amp; Dispatch Schedule</h3>
                    <p className="font-body font-semibold text-xs text-gray-500">
                      Configure your fulfillment schedule and customer-facing delivery guarantees.
                    </p>
                  </div>
                </div>

                {/* Pickup Ready Days */}
                <div className="space-y-2">
                  <label className="block font-body font-semibold text-xs uppercase tracking-wider text-gray-600">
                    Pickup Ready Days
                  </label>
                  <input
                    type="text"
                    value={settings.dispatch_days}
                    onChange={(e) => setSettings({ ...settings, dispatch_days: e.target.value })}
                    placeholder="e.g. Mon - Sat, Mon - Fri, Daily"
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 font-body font-semibold text-sm focus:outline-brand-primary shadow-sm text-brand-dark"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] font-body text-gray-400 self-center">Quick Presets:</span>
                    {["Mon - Sat", "Mon - Fri", "Daily (7 Days)", "Mon, Wed, Fri"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSettings({ ...settings, dispatch_days: preset })}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-body font-semibold transition-all ${
                          settings.dispatch_days === preset
                            ? "bg-brand-primary/15 border-brand-primary text-brand-primary"
                            : "bg-white border-gray-200 text-gray-600 hover:border-brand-primary/40"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Turnaround Window */}
                <div className="space-y-2">
                  <label className="block font-body font-semibold text-xs uppercase tracking-wider text-gray-600">
                    Turnaround Processing Time
                  </label>
                  <input
                    type="text"
                    value={settings.dispatch_time}
                    onChange={(e) => setSettings({ ...settings, dispatch_time: e.target.value })}
                    placeholder="e.g. 24-48 hours, Same Day"
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 font-body font-semibold text-sm focus:outline-brand-primary shadow-sm text-brand-dark"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] font-body text-gray-400 self-center">Quick Presets:</span>
                    {["24-48 hours", "Same Day", "1-2 Business Days", "3-5 Business Days"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSettings({ ...settings, dispatch_time: preset })}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-body font-semibold transition-all ${
                          settings.dispatch_time === preset
                            ? "bg-brand-primary/15 border-brand-primary text-brand-primary"
                            : "bg-white border-gray-200 text-gray-600 hover:border-brand-primary/40"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily Cutoff Time */}
                <div className="space-y-2">
                  <label className="block font-body font-semibold text-xs uppercase tracking-wider text-gray-600">
                    Daily Order Cutoff Time
                  </label>
                  <input
                    type="text"
                    value={settings.cutoff_time}
                    onChange={(e) => setSettings({ ...settings, cutoff_time: e.target.value })}
                    placeholder="e.g. 2:00 PM, 12:00 PM"
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 font-body font-semibold text-sm focus:outline-brand-primary shadow-sm text-brand-dark"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] font-body text-gray-400 self-center">Quick Presets:</span>
                    {["12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSettings({ ...settings, cutoff_time: preset })}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-body font-semibold transition-all ${
                          settings.cutoff_time === preset
                            ? "bg-brand-primary/15 border-brand-primary text-brand-primary"
                            : "bg-white border-gray-200 text-gray-600 hover:border-brand-primary/40"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] font-body text-gray-500 pt-1">
                    Orders received before this cutoff qualify for same-day dispatch preparation.
                  </p>
                </div>

                {/* Storefront Schedule Live Preview */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs font-body font-semibold text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
                    <Clock size={14} /> Storefront Live Preview
                  </div>
                  <p className="text-gray-800">
                    📦 <strong>Ready for Dispatch:</strong> {settings.dispatch_days || "Mon - Sat"} ({settings.dispatch_time || "24-48 hours"}) • Orders placed before {settings.cutoff_time || "2:00 PM"} are prepped for same-day dispatch.
                  </p>
                </div>

                {/* Registered Shiprocket Pickup Warehouse */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 text-xs font-body space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-dark flex items-center gap-1.5">
                      <MapPin size={14} className="text-brand-primary" /> Active Pickup Warehouse
                    </span>
                    <span className="bg-[#f0fdf4] text-[#166534] px-2 py-0.5 rounded-full font-bold text-[10px] border border-[#bbf7d0]">
                      Shiprocket Verified
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs leading-relaxed">
                    Pickup Nickname: <strong className="text-brand-dark">work</strong><br />
                    Location: Gautam Buddha Nagar, Uttar Pradesh 201310, India<br />
                    Couriers: Automated selection (Bluedart, Delhivery, DTDC, Shadowfax via Shiprocket API)
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING & INVENTORY */}
              <div className="space-y-8">
                {/* Pricing & Stock Card */}
                <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-3xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-brand-primary/10">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Tag size={20} />
                    </div>
                    <div>
                      <h3 className="font-display font-normal text-xl text-brand-dark">Pricing &amp; Inventory Status</h3>
                      <p className="font-body font-semibold text-xs text-gray-500">
                        Update online selling price, MRP display, and pause orders when out of stock.
                      </p>
                    </div>
                  </div>

                  {/* Pricing Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-body font-semibold text-xs uppercase tracking-wider text-gray-600">
                        Selling Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={settings.price}
                          onChange={(e) => setSettings({ ...settings, price: Number(e.target.value) || 0 })}
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white font-body font-semibold text-sm focus:outline-brand-primary shadow-sm text-brand-dark"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500">Amount charged at Razorpay checkout.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-body font-semibold text-xs uppercase tracking-wider text-gray-600">
                        Original MRP (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={settings.original_price}
                          onChange={(e) => setSettings({ ...settings, original_price: Number(e.target.value) || 0 })}
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white font-body font-semibold text-sm focus:outline-brand-primary shadow-sm text-brand-dark"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500">Strikethrough price showing savings.</p>
                    </div>
                  </div>

                  {/* Pricing Live Preview */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-body text-gray-400 uppercase tracking-wider block">Storefront Display</span>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className="font-display font-normal text-3xl text-brand-dark">₹{settings.price}</span>
                        {settings.original_price > settings.price && (
                          <span className="font-body text-sm text-gray-400 line-through">₹{settings.original_price}</span>
                        )}
                      </div>
                    </div>

                    {settings.original_price > settings.price && (
                      <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-3 py-1 rounded-full text-xs font-bold font-body">
                        {Math.round(((settings.original_price - settings.price) / settings.original_price) * 100)}% SAVINGS
                      </span>
                    )}
                  </div>

                  {/* Stock Availability Toggle */}
                  <div className="pt-2 border-t border-brand-primary/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-body font-bold text-sm text-brand-dark">Accepting Customer Orders</h4>
                        <p className="text-xs text-gray-500 font-body">
                          Toggle OFF to temporarily pause purchasing if physical stock is depleted.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, in_stock: !settings.in_stock })}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                          settings.in_stock ? "bg-emerald-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            settings.in_stock ? "translate-x-8" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Stock Badge Label */}
                    <div className="space-y-2">
                      <label className="block font-body font-semibold text-xs uppercase tracking-wider text-gray-600">
                        Stock Badge Text
                      </label>
                      <input
                        type="text"
                        value={settings.stock_badge}
                        onChange={(e) => setSettings({ ...settings, stock_badge: e.target.value })}
                        placeholder="e.g. In Stock, Limited Edition, Pre-Order"
                        className="w-full border border-gray-200 bg-white rounded-xl p-3 font-body font-semibold text-sm focus:outline-brand-primary shadow-sm text-brand-dark"
                      />
                      <div className="flex flex-wrap gap-2 pt-1">
                        {["In Stock", "Limited Stock (Few Remaining)", "Special Edition", "Pre-Order Available"].map((badge) => (
                          <button
                            key={badge}
                            type="button"
                            onClick={() => setSettings({ ...settings, stock_badge: badge })}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-body font-semibold transition-all ${
                              settings.stock_badge === badge
                                ? "bg-brand-primary/15 border-brand-primary text-brand-primary"
                                : "bg-white border-gray-200 text-gray-600 hover:border-brand-primary/40"
                            }`}
                          >
                            {badge}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: TOP ANNOUNCEMENT BANNER */}
                <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-3xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-brand-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Megaphone size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-normal text-xl text-brand-dark">Website Announcement Bar</h3>
                        <p className="font-body font-semibold text-xs text-gray-500">
                          Displays a prominent banner at the very top of all pages.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, announcement_enabled: !settings.announcement_enabled })}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                        settings.announcement_enabled ? "bg-brand-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          settings.announcement_enabled ? "translate-x-8" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-body font-semibold text-xs uppercase tracking-wider text-gray-600">
                      Banner Message
                    </label>
                    <input
                      type="text"
                      value={settings.announcement_text}
                      onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                      placeholder="e.g. Special Gita Jayanti Edition — Free Delivery Across India"
                      className="w-full border border-gray-200 bg-white rounded-xl p-3 font-body font-semibold text-sm focus:outline-brand-primary shadow-sm text-brand-dark"
                    />

                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        "Special Gita Jayanti Edition — Free Delivery Across India",
                        "📦 Fast Dispatch: All Orders Shipped Within 24 Hours!",
                        "✨ Exclusive Gold-Embossed Gita Diary — Limited Festive Batch",
                      ].map((msg) => (
                        <button
                          key={msg}
                          type="button"
                          onClick={() => setSettings({ ...settings, announcement_text: msg })}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-body font-semibold text-left transition-all ${
                            settings.announcement_text === msg
                              ? "bg-brand-primary/15 border-brand-primary text-brand-primary"
                              : "bg-white border-gray-200 text-gray-600 hover:border-brand-primary/40"
                          }`}
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Announcement Live Banner Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-body text-gray-500 uppercase tracking-wider block">
                      Live Banner Preview ({settings.announcement_enabled ? "Active on Website" : "Currently Hidden"})
                    </span>
                    <div
                      className={`w-full rounded-xl p-2.5 text-xs font-body font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                        settings.announcement_enabled
                          ? "bg-brand-primary text-white shadow-sm"
                          : "bg-gray-100 text-gray-400 border border-dashed border-gray-300"
                      }`}
                    >
                      <Sparkles size={14} className={settings.announcement_enabled ? "text-amber-200" : "text-gray-400"} />
                      <span>{settings.announcement_text || "No announcement text configured"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SAVE BAR */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-brand-primary/15 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                <p className="font-body text-xs text-gray-600">
                  Settings are immediately synced to Supabase database with persistent local fallback.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveSettings()}
                disabled={savingSettings}
                className="w-full sm:w-auto bg-brand-primary text-white font-button font-bold text-base px-8 py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(226,154,44,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingSettings ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                Save All Changes Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


