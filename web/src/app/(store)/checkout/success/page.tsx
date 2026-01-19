"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useCart } from "@/store/useCart";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const clearCart = useCart(state => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="py-24 text-center space-y-12 max-w-2xl mx-auto">
      <div className="relative inline-block">
         <div className="w-32 h-32 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-6xl animate-bounce">
           ✅
         </div>
         <div className="absolute -inset-4 bg-green-500/20 blur-3xl -z-10 rounded-full" />
      </div>

      <div className="space-y-4">
         <h1 className="text-5xl font-black tracking-tighter">Order Confirmed!</h1>
         <p className="text-zinc-500 text-lg">Thank you for your purchase. Your order <span className="font-mono text-black dark:text-white font-bold">#{orderId?.slice(0,8)}</span> is being processed.</p>
      </div>

      <div className="p-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] flex flex-col items-center gap-6">
         <p className="text-sm font-medium">A confirmation email has been sent to your inbox.</p>
         <div className="flex gap-4 w-full">
            <Link href="/products" className="flex-1 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-2xl font-black text-center">
               Keep Shopping
            </Link>
            <button className="flex-1 py-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl font-black text-center">
               Track Order
            </button>
         </div>
      </div>

      <div className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400">
         Poyken E-commerce Platform • Highly Secure Transfer
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

