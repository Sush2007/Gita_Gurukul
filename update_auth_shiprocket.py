import re

with open("src/context/AuthContext.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_handler = """                status: "Processing",
                date: serverTimestamp(),
              });
            }
            toast.success("Payment Successful!");"""

new_handler = """                status: "Processing",
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
            toast.success("Payment Successful!");"""

content = content.replace(old_handler, new_handler)

with open("src/context/AuthContext.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated AuthContext with Shiprocket trigger")
