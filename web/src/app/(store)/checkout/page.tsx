"use client";

import { useCart } from "@/store/useCart";
import { useState, useEffect } from "react";
import { createOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { validateVoucherAction } from "@/actions/promotions-public";
import { Ticket, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [checkingVoucher, setCheckingVoucher] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<any>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const router = useRouter();

  const subTotal = totalPrice();

  // Re-validate voucher whenever subTotal or items change (to handle automatic promos too)
  useEffect(() => {
     handleApplyVoucher(voucherCode);
  }, [subTotal, items.length]);

  async function handleApplyVoucher(code?: string) {
    setCheckingVoucher(true);
    setVoucherError(null);
    
    const result = await validateVoucherAction({
       code: code || undefined,
       items: items.map(i => ({ skuId: i.id, quantity: i.quantity, sku: { price: i.price, productId: i.productId } })), // Simplified representation for rule evaluation
       subTotal: subTotal
    });

    if (result.error) {
       setVoucherError(result.error);
       setDiscountInfo(null);
    } else {
       setDiscountInfo(result.data);
    }
    setCheckingVoucher(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const orderData = {
      addressId: undefined, // Will be handled by Order Service if not provided, or we can get it from an address selector
      paymentMethod: formData.get('paymentMethod'),
      voucherCode: voucherCode || undefined,
      note: formData.get('note'),
    };

    const result = await createOrderAction(orderData as any);
    if (result.success) {
      clearCart();
      router.push(`/checkout/success?id=${result.orderId}`);
    } else {
      alert(result.error);
    }
    setLoading(false);
  }

  if (items.length === 0) {
     return <div className="py-24 text-center font-bold text-zinc-500 italic">Your cart is empty. Diverting back to store...</div>;
  }

  const discountAmount = discountInfo?.totalDiscount || 0;
  const finalTotal = subTotal - discountAmount;

  return (
    <div className="py-12 space-y-12 max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-black tracking-tighter">Checkout</h1>
        <div className="h-px flex-1 bg-zinc-800" />
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
           <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Payment
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
           {/* Section 1: Shipping */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black flex items-center justify-center text-xs">1</span>
                 Shipping Details
              </h2>
              <GlassCard className="p-8 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" required placeholder="Full Name" className="w-full px-6 py-4 rounded-2xl bg-black/20 border border-white/5 outline-none focus:border-primary transition-colors" />
                    <input name="phone" required placeholder="Phone Number" className="w-full px-6 py-4 rounded-2xl bg-black/20 border border-white/5 outline-none focus:border-primary transition-colors" />
                 </div>
                 <textarea name="address" required placeholder="Street Address, Ward, District..." rows={3} className="w-full px-6 py-4 rounded-2xl bg-black/20 border border-white/5 outline-none focus:border-primary transition-colors" />
              </GlassCard>
           </div>

           {/* Section 2: Payment */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black flex items-center justify-center text-xs">2</span>
                 Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <label className="relative flex items-center gap-4 p-6 border border-white/5 bg-zinc-900/40 rounded-3xl cursor-pointer hover:border-primary/50 transition-all group">
                    <input type="radio" name="paymentMethod" value="COD" defaultChecked className="peer sr-only" />
                    <div className="space-y-1">
                       <p className="font-bold">Cash on Delivery</p>
                       <p className="text-[10px] text-zinc-500 uppercase font-black">Pay when you receive</p>
                    </div>
                    <div className="ml-auto w-6 h-6 rounded-full border-2 border-zinc-700 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                 </label>
                 <label className="relative flex items-center gap-4 p-6 border border-white/5 bg-zinc-900/40 rounded-3xl cursor-pointer hover:border-primary/50 transition-all group">
                    <input type="radio" name="paymentMethod" value="BANK_TRANSFER" className="peer sr-only" />
                    <div className="space-y-1">
                       <p className="font-bold">Bank Transfer</p>
                       <p className="text-[10px] text-zinc-500 uppercase font-black">Transfer via QR Code</p>
                    </div>
                    <div className="ml-auto w-6 h-6 rounded-full border-2 border-zinc-700 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                 </label>
              </div>
           </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
           <GlassCard className="p-8 sticky top-8 space-y-8 overflow-visible">
              <h2 className="font-black text-xl tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                 {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                       <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-white/5 shrink-0 animate-pulse" />
                       <div className="flex-1 space-y-1">
                          <p className="font-bold text-sm leading-tight">{item.name}</p>
                          <div className="flex justify-between items-center">
                             <p className="text-[10px] text-zinc-500 font-bold uppercase">Qty: {item.quantity}</p>
                             <p className="font-black text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Voucher Input */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                 <label className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2">
                    <Ticket className="w-3 h-3" /> Promo Code
                 </label>
                 <div className="flex gap-2">
                    <input 
                        value={voucherCode}
                        onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-primary" 
                        placeholder="ENTER CODE" 
                    />
                    <button 
                         type="button"
                         onClick={() => handleApplyVoucher(voucherCode)}
                         disabled={checkingVoucher || !voucherCode}
                         className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                        Apply
                    </button>
                 </div>
                 {voucherError && <p className="text-[10px] text-red-500 font-bold">{voucherError}</p>}
                 {discountInfo?.appliedPromos?.length > 0 && (
                     <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                        {discountInfo.appliedPromos.map((p: any) => (
                           <div key={p.id} className="flex items-center justify-between text-[10px] text-emerald-500 font-black uppercase">
                              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {p.name} Applied</span>
                              <span>-${p.discount.toFixed(2)}</span>
                           </div>
                        ))}
                     </div>
                 )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                 <div className="flex justify-between text-sm text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">${subTotal.toFixed(2)}</span>
                 </div>
                 {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-500">
                        <span>Discount</span>
                        <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                    </div>
                 )}
                 <div className="flex justify-between text-sm text-zinc-400">
                    <span>Shipping</span>
                    <span className="font-bold text-white">Calculated at next step</span>
                 </div>
                 <div className="flex justify-between pt-4 text-3xl font-black tracking-tighter">
                    <span>Total</span>
                    <span className="bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        ${finalTotal.toFixed(2)}
                    </span>
                 </div>
              </div>
              
              <button 
                disabled={loading}
                type="submit" 
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group"
              >
                {loading ? 'Processing...' : (
                    <>
                        Place Order <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>

              <p className="text-[10px] text-center text-zinc-500 leading-relaxed font-medium">
                 Secure Encrypted Checkout. Free returns within 30 days.
              </p>
           </GlassCard>
        </div>
      </form>
    </div>
  );
}
