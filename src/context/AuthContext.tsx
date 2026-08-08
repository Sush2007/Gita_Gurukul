"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  pincode: string;
}

export type LoginIntent = "CHECKOUT" | "PROFILE" | "NONE";

export interface CheckoutData {
  amount: number;
  items: string;
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
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          const emptyProfile = { name: currentUser.displayName || "", email: currentUser.email || "", phone: currentUser.phoneNumber || "", address: "", state: "", pincode: "" };
          await setDoc(docRef, emptyProfile);
          setProfile(emptyProfile);
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
        handler: async function (response: any) {
          try {
            const currentUser = auth.currentUser;
            if (currentUser) {
              await addDoc(collection(db, "users", currentUser.uid, "orders"), {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: data.amount,
                items: data.items,
                status: "Processing",
                date: serverTimestamp(),
              });
              
              // Trigger Shiprocket Order Creation
              try {
                fetch("/api/shiprocket", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: response.razorpay_order_id,
                    amount: data.amount,
                    items: data.items,
                    profile: currentProfile,
                  })
                }).catch(e => console.error("Shiprocket API call failed:", e));
              } catch (e) {
                console.error("Failed to initiate Shiprocket:", e);
              }
            }
            toast.success("Payment Successful!");
            closeLoginModal();
            router.push("/receipt?orderId=" + response.razorpay_order_id + "&amount=" + data.amount);
          } catch (e) {
            console.error("Error saving order:", e);
            toast.error("Payment succeeded but order tracking failed.");
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
