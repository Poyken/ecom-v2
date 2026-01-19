"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string; // SKU ID
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string; // e.g. "Size: M, Color: Black"
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const existing = state.items.find(i => i.id === newItem.id);
        if (existing) {
          return {
            items: state.items.map(i => 
              i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
            )
          };
        }
        return { items: [...state.items, newItem] };
      }),
      removeItem: (skuId) => set((state) => ({
        items: state.items.filter(i => i.id !== skuId)
      })),
      updateQuantity: (skuId, quantity) => set((state) => ({
        items: state.items.map(i => i.id === skuId ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    }),
    {
      name: 'poyken-cart',
    }
  )
);
