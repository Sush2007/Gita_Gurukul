"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { User, MapPin, Mail, Phone, ShieldCheck, LogOut, Loader2, Edit3, Package, Calendar, IndianRupee } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const { user, profile, loading, updateProfileState, logout } = useAuth();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || user?.phoneNumber || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
      });
      if (!profile.address || !profile.pincode) {
        setIsEditing(true);
      }
    }
  }, [profile, user]);

  const fetchOrders = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.uid)
          .order("created_at", { ascending: false });

        if (data) {
          setOrders(data);
        } else if (error) {
          console.error("Supabase orders query error:", error.message);
        }
      } catch (error) {
        console.error("Error fetching orders from Supabase:", error);
      } finally {
        setLoadingOrders(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    const toastId = toast.loading("Cancelling order...");
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, userId: user?.uid }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Order cancelled successfully", { id: toastId });
        await fetchOrders();
      } else {
        toast.error(data.error || "Failed to cancel order", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel order", { id: toastId });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedProfile = {
        id: user.uid,
        ...formData,
        phone: formData.phone || user?.phoneNumber || "",
        updated_at: new Date().toISOString(),
      };
      await supabase.from("profiles").upsert(updatedProfile);
      updateProfileState(updatedProfile);
      toast.success("Profile saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile to Supabase:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] pt-8 md:pt-12 bg-[#faf7f2] pb-20">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6">
        
        <AnimatedSection className="mb-8 text-center flex flex-col items-center animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold tracking-wide mb-3 shadow-xs">
            <span>👤</span>
            <span>Customer Portal</span>
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-brand-dark mb-2">
            My Account &amp; Orders
          </h1>
          <p className="font-body text-gray-600 text-base">
            Manage your delivery address, live courier tracking, and order history.
          </p>
        </AnimatedSection>

        {/* PROFILE CARD */}
        <AnimatedSection delay={100} className="bg-[#FDFBF7] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-primary/20 overflow-hidden mb-10">
          <div className="bg-brand-dark px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white">
                <User size={32} />
              </div>
              <div>
                <h2 className="font-display font-normal text-2xl text-white">
                  {profile?.name || "Spiritual Seeker"}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-brand-primary">
                  <ShieldCheck size={16} />
                  <span className="text-sm font-semibold tracking-wide uppercase">Verified Member</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors border border-gray-600 hover:border-gray-400 rounded-md px-4 py-2 font-body font-semibold text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
              <h3 className="font-display font-normal text-xl text-brand-dark">
                Shipping Details
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-brand-primary hover:text-black transition-colors font-body text-sm font-semibold"
                >
                  <Edit3 size={16} /> Edit Details
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-sm font-semibold text-black">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="border border-gray-200 bg-gray-50 rounded-md p-3 font-body font-semibold text-sm focus:outline-brand-primary" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-sm font-semibold text-black">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-200 bg-gray-50 rounded-md p-3 font-body font-semibold text-sm focus:outline-brand-primary" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-body text-sm font-semibold text-black">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))} 
                      placeholder="Enter your mobile number" 
                      className="border border-gray-200 bg-gray-50 rounded-md p-3 font-body font-semibold text-sm focus:outline-brand-primary" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-body text-sm font-semibold text-black">Complete Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="border border-gray-200 bg-gray-50 rounded-md p-3 font-body font-semibold text-sm focus:outline-brand-primary resize-none" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-sm font-semibold text-black">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="border border-gray-200 bg-gray-50 rounded-md p-3 font-body font-semibold text-sm focus:outline-brand-primary" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-sm font-semibold text-black">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="border border-gray-200 bg-gray-50 rounded-md p-3 font-body font-semibold text-sm focus:outline-brand-primary" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-sm font-semibold text-black">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} className="border border-gray-200 bg-gray-50 rounded-md p-3 font-body font-semibold text-sm focus:outline-brand-primary" required />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-black font-body font-semibold px-4">Cancel</button>
                  <button type="submit" disabled={saving} className="bg-brand-primary text-white font-button font-bold px-8 py-3 rounded-md shadow-md hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(226,154,44,0.3)] transition-all duration-300 flex items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 animate-in fade-in duration-300">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Address</p>
                  <p className="font-body font-semibold text-black text-[15px]">{profile?.address || "No address provided."}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">City, State & Pincode</p>
                  <p className="font-body font-semibold text-black text-[15px]">
                    {profile?.state ? `${profile.city ? profile.city + ', ' : ''}${profile.state}, ${profile.pincode}` : "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Email</p>
                  <p className="font-body font-semibold text-black text-[15px]">{profile?.email || "No email provided."}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="font-body font-semibold text-black text-[15px]">{profile?.phone || user?.phoneNumber || "Not provided"}</p>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* PAST PURCHASES CARD */}
        <AnimatedSection delay={200} className="bg-[#FDFBF7] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-primary/20 overflow-hidden">
          <div className="p-5 sm:p-8">
            <h3 className="font-display font-normal text-xl text-brand-dark mb-6 flex items-center gap-2">
              <Package className="text-brand-primary" />
              Past Purchases
            </h3>
            
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-brand-primary" size={32} />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-body font-semibold">
                No purchases found yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order, idx) => {
                  const status = order.order_status || order.status || "Processing";
                  const isProcessing = status.toLowerCase() === "processing";
                  const isCancelled = status.toLowerCase() === "cancelled";
                  const isShipped = status.toLowerCase() === "shipped";
                  const isDelivered = status.toLowerCase() === "delivered";

                  return (
                    <div key={idx} className="border border-gray-100 rounded-lg p-5 hover:border-brand-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-display font-normal text-brand-dark break-all">{order.razorpay_order_id || order.id}</span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            isDelivered ? "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]" :
                            isShipped ? "bg-blue-50 text-blue-800 border-blue-200" :
                            isCancelled ? "bg-red-50 text-red-800 border-red-200" :
                            "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {status}
                          </span>
                        </div>
                        <p className="font-body font-semibold text-sm text-gray-950 mb-1">{order.items}</p>
                        <p className="font-body font-semibold text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> Ordered on {order.created_at ? new Date(order.created_at).toLocaleDateString() : (order.date?.toDate ? new Date(order.date.toDate()).toLocaleDateString() : "Recently")}
                        </p>
                        {order.shiprocket?.courier_name && (
                          <p className="font-body text-xs text-blue-700 font-semibold mt-1.5 flex items-center gap-1">
                            Courier: {order.shiprocket.courier_name} {order.shiprocket?.awb_code ? `• AWB: ${order.shiprocket.awb_code}` : ""}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:items-end justify-between gap-2">
                        <p className="font-display font-normal text-lg text-brand-primary flex items-center sm:justify-end">
                          <IndianRupee size={16} /> {order.amount}
                        </p>
                        {isProcessing && order.type !== "donation" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingId === order.id}
                            className="text-xs font-body font-semibold text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 bg-red-50/50 hover:bg-red-50 rounded px-2.5 py-1 transition-all self-start sm:self-auto flex items-center gap-1"
                          >
                            {cancellingId === order.id && <Loader2 size={12} className="animate-spin" />}
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
