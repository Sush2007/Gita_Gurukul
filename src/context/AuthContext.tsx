"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state: string;
  pincode: string;
}

export type LoginIntent = "CHECKOUT" | "PROFILE" | "NONE";

export interface CheckoutData {
  amount: number;
  items: string;
  quantity?: number;
  donorName?: string;
  donorMessage?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isLoginModalOpen: boolean;
  loginIntent: LoginIntent;
  checkoutData: CheckoutData | null;
  openLoginModal: (intent?: LoginIntent, data?: CheckoutData) => void;
  closeLoginModal: () => void;
  logout: () => Promise<void>;
  updateProfileState: (data: UserProfile) => void;
  initRazorpay: (data: CheckoutData, currentProfile?: UserProfile | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginIntent, setLoginIntent] = useState<LoginIntent>("NONE");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.uid)
            .maybeSingle();

          if (data) {
            setProfile(data as UserProfile);
          } else {
            const emptyProfile = {
              id: currentUser.uid,
              name: currentUser.displayName || "",
              email: currentUser.email || "",
              phone: currentUser.phoneNumber || "",
              address: "",
              city: "",
              state: "",
              pincode: "",
            };
            await supabase.from("profiles").upsert(emptyProfile);
            setProfile(emptyProfile);
          }
        } catch (err) {
          console.error("Error loading profile from Supabase:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openLoginModal = (intent: LoginIntent = "NONE", data?: CheckoutData) => {
    setLoginIntent(intent);
    if (data) setCheckoutData(data);
    setIsLoginModalOpen(true);
  };
  
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setTimeout(() => {
      setLoginIntent("NONE");
      setCheckoutData(null);
    }, 300);
  };

  const logout = async () => {
    await auth.signOut();
  };

  const updateProfileState = (data: UserProfile) => {
    setProfile(data);
  };

  const initRazorpay = async (data: CheckoutData, currentProfile: UserProfile | null = profile) => {
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: data.amount }),
      });
      const resData = await res.json();
      
      if (!res.ok) throw new Error(resData.error || "Failed to create order");
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: "INR",
        name: "Gita Gurukul",
        description: data.items,
        order_id: resData.orderId,
        notes: {
          donor_name: data.donorName || "",
          donor_message: data.donorMessage || "",
        },
        handler: async function (response: any) {
          try {
            const currentUser = auth.currentUser;
            const customerDetails = {
              name: currentProfile?.name || currentUser?.displayName || data.donorName || "Customer",
              email: currentProfile?.email || currentUser?.email || "",
              phone: currentProfile?.phone || currentUser?.phoneNumber || "",
              address: currentProfile?.address || "",
              city: currentProfile?.city || "",
              state: currentProfile?.state || "",
              pincode: currentProfile?.pincode || "",
            };

            const isDonation = Boolean(data.donorName || data.items?.toLowerCase().includes("donation"));

            const orderRecord = {
              id: response.razorpay_order_id,
              order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: data.amount,
              items: data.items,
              quantity: data.quantity || 1,
              type: isDonation ? "donation" : "order",
              donor_name: data.donorName || "",
              donor_message: data.donorMessage || "",
              customer: customerDetails,
              status: "Processing",
              payment_status: "Paid",
              order_status: "Processing",
              shiprocket: {
                status: isDonation ? "N/A (Donation)" : "Pending",
                shipment_id: null,
                order_id: null,
                awb_code: null,
                courier_name: null,
                error: null,
                updated_at: new Date().toISOString(),
              },
              user_id: currentUser ? currentUser.uid : "guest",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            // 1. Save to Supabase "orders" table
            const { error: saveError } = await supabase.from("orders").upsert(orderRecord);
            if (saveError) {
              console.warn("Supabase orders upsert notice:", saveError.message);
            }

            // 2. Trigger Shiprocket for physical store orders
            if (!isDonation) {
              fetch("/api/shiprocket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  amount: data.amount,
                  items: data.items,
                  quantity: data.quantity || 1,
                  profile: customerDetails,
                }),
              })
                .then(async (srRes) => {
                  const srData = await srRes.json().catch(() => ({}));
                  if (srRes.ok && srData.success) {
                    await supabase
                      .from("orders")
                      .update({
                        shiprocket: {
                          status: "Created",
                          shipment_id: srData.shipment_id || null,
                          order_id: srData.order_id || null,
                          awb_code: srData.awb_code || null,
                          courier_name: srData.courier_name || null,
                          error: null,
                          updated_at: new Date().toISOString(),
                        },
                        updated_at: new Date().toISOString(),
                      })
                      .eq("id", response.razorpay_order_id);
                  } else {
                    await supabase
                      .from("orders")
                      .update({
                        shiprocket: {
                          status: "Failed",
                          shipment_id: null,
                          order_id: null,
                          awb_code: null,
                          courier_name: null,
                          error: srData.error || srData.details?.message || "Failed to push to Shiprocket",
                          updated_at: new Date().toISOString(),
                        },
                        updated_at: new Date().toISOString(),
                      })
                      .eq("id", response.razorpay_order_id);
                  }
                })
                .catch(async (err) => {
                  console.error("Shiprocket API call failed:", err);
                  await supabase
                    .from("orders")
                    .update({
                      shiprocket: {
                        status: "Failed",
                        error: err.message || "Network error calling Shiprocket",
                        updated_at: new Date().toISOString(),
                      },
                      updated_at: new Date().toISOString(),
                    })
                    .eq("id", response.razorpay_order_id);
                });
            }

            toast.success("Payment Successful!");
            closeLoginModal();
            router.push("/receipt?orderId=" + response.razorpay_order_id + "&amount=" + data.amount);
          } catch (e) {
            console.error("Error saving order:", e);
            toast.error("Payment succeeded! Preparing receipt...");
            closeLoginModal();
            router.push("/receipt?orderId=" + response.razorpay_order_id + "&amount=" + data.amount);
          }
        },
        prefill: {
          name: currentProfile?.name || "",
          email: currentProfile?.email || "",
          contact: currentProfile?.phone || "",
        },
        theme: {
          color: "#D98A36",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isLoginModalOpen,
        loginIntent,
        checkoutData,
        openLoginModal,
        closeLoginModal,
        logout,
        updateProfileState,
        initRazorpay
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
