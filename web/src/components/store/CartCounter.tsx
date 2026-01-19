"use client";

import { useCart } from "@/store/useCart";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartCounter() {
  const totalItems = useCart(state => state.totalItems());
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch for persisted state
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="p-2 rounded-full relative">🛒</div>
  );

  return (
    <Link href="/cart" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors relative group">
      🛒
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-full text-[10px] font-black flex items-center justify-center scale-100 group-hover:scale-110 transition-transform">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
