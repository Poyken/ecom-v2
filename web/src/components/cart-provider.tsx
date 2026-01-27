'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  skuId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (skuId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (newItem: CartItem) => {
    setItems((current) => {
      const existing = current.find((i) => i.skuId === newItem.skuId);
      if (existing) {
        return current.map((i) =>
          i.skuId === newItem.skuId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...current, newItem];
    });
  };

  const removeFromCart = (skuId: string) => {
    setItems((current) => current.filter((i) => i.skuId !== skuId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
