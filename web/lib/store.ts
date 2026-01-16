import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Auth Store - Manages authentication state
 */
interface AuthState {
  accessToken: string | null;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthState['user']) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) =>
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/**
 * Cart Store - Manages cart state
 */
interface CartState {
  itemCount: number;
  setItemCount: (count: number) => void;
  incrementItemCount: () => void;
  decrementItemCount: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  setItemCount: (count) => set({ itemCount: count }),
  incrementItemCount: () => set((state) => ({ itemCount: state.itemCount + 1 })),
  decrementItemCount: () =>
    set((state) => ({ itemCount: Math.max(0, state.itemCount - 1) })),
}));

/**
 * UI Store - Global UI state
 */
interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
