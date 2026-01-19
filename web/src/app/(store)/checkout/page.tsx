"use client";

import { useCart } from "@/store/useCart";
import { useState } from "react";
import { createOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const orderData = {
      shippingAddress: formData.get('address'),
      items: items.map(i => ({ skuId: i.id, quantity: i.quantity })),
      paymentMethod: formData.get('paymentMethod'),
    };

    const result = await createOrderAction(orderData);
    if (result.success) {
      clearCart();
      router.push(`/checkout/success?id=${result.orderId}`);
    } else {
      alert(result.error);
    }
    setLoading(false);
  }

  if (items.length === 0) {
     return <div className="py-24 text-center">Redirecting to cart...</div>;
  }

  return (
    <div className="py-12 space-y-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter">Secure Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
           {/* Section 1: Shipping */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black flex items-center justify-center text-xs">1</span>
                 Shipping Information
              </h2>
              <div className="space-y-4">
                 <input name="name" required placeholder="Full Name" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 outline-none focus:border-zinc-500 transition-colors" />
                 <input name="email" type="email" required placeholder="Email Address" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 outline-none focus:border-zinc-500 transition-colors" />
                 <textarea name="address" required placeholder="Full Shipping Address" rows={3} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 outline-none focus:border-zinc-500 transition-colors" />
              </div>
           </div>

           {/* Section 2: Payment */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black flex items-center justify-center text-xs">2</span>
                 Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                 <label className="relative flex items-center gap-4 p-6 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl cursor-pointer has-[:checked]:border-primary transition-all">
                    <input type="radio" name="paymentMethod" value="COD" defaultChecked className="hidden peer" />
                    <div className="space-y-1">
                       <p className="font-bold">COD</p>
                       <p className="text-[10px] text-zinc-500 uppercase font-black">Cash on Delivery</p>
                    </div>
                    <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700 peer-checked:bg-primary peer-checked:border-primary" />
                 </label>
                 <label className="relative flex items-center gap-4 p-6 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl cursor-pointer has-[:checked]:border-primary transition-all">
                    <input type="radio" name="paymentMethod" value="BANK_TRANSFER" className="hidden peer" />
                    <div className="space-y-1">
                       <p className="font-bold">BANK</p>
                       <p className="text-[10px] text-zinc-500 uppercase font-black">Bank Transfer</p>
                    </div>
                    <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700 peer-checked:bg-primary peer-checked:border-primary" />
                 </label>
              </div>
           </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
           <div className="p-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] sticky top-8 space-y-8">
              <h2 className="font-bold text-lg">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                 {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                       <div className="space-y-0.5">
                          <p className="font-bold">{item.name}</p>
                          <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                       </div>
                       <p className="font-black">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                 <div className="flex justify-between text-2xl">
                    <span className="font-black">Total</span>
                    <span className="font-black tracking-tighter">${totalPrice().toFixed(2)}</span>
                 </div>
                 
                 <button 
                   disabled={loading}
                   type="submit" 
                   className="w-full py-5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20"
                 >
                   {loading ? 'Processing...' : 'Complete Order'}
                 </button>
              </div>

              <p className="text-[10px] text-center text-zinc-500 leading-relaxed font-medium">
                 By clicking "Complete Order", you agree to our Terms of Service and Privacy Policy. Your data is protected by AES-256 encryption.
              </p>
           </div>
        </div>
      </form>
    </div>
  );
}
