"use client";

import { useCart } from "@/store/useCart";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-24 text-center space-y-6">
        <div className="text-8xl grayscale opacity-20">🛒</div>
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="text-zinc-500">Looks like you haven't added anything yet.</p>
        <Link href="/products" className="inline-block px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-full font-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-12">
      <h1 className="text-4xl font-black tracking-tighter">Shopping Cart ({totalItems()})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900 group">
              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl grayscale">📦</div>
              <div className="flex-1 space-y-1">
                 <div className="flex justify-between">
                    <h3 className="font-bold underline-offset-4 group-hover:underline">{item.name}</h3>
                    <span className="font-black">${item.price.toFixed(2)}</span>
                 </div>
                 <p className="text-xs text-zinc-500 font-medium">{item.options}</p>
                 
                 <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-full h-8 overflow-hidden">
                       <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">-</button>
                       <span className="px-2 text-xs font-bold w-8 text-center">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Remove</button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-8">
           <div className="p-8 bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900 space-y-6">
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-bold">${totalPrice().toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Shipping</span>
                    <span className="text-green-500 font-bold">FREE</span>
                 </div>
                 <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-xl">
                    <span className="font-black">Total</span>
                    <span className="font-black tracking-tighter">${totalPrice().toFixed(2)}</span>
                 </div>
              </div>

              <Link 
                href="/checkout" 
                className="block w-full py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-2xl font-black text-center hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                Proceed to Checkout
              </Link>

              <div className="text-[10px] text-center text-zinc-400 font-medium px-4">
                 Taxes and shipping calculated at checkout. Secure SSL Encrypted payment.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
