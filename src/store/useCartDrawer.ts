import { create } from "zustand";

// ---------------------------------------------------------------------------
// useCartDrawer
// ---------------------------------------------------------------------------
// Ephemeral UI state for the mini-cart drawer. Zustand keeps this trivial,
// cross-component toggle out of Redux (which is reserved for app-wide domain
// state). The Navbar opens it; the CartDrawer (mounted in RootLayout) reads it.
// ---------------------------------------------------------------------------

interface CartDrawerState {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartDrawer = create<CartDrawerState>((set) => ({
  open: false,
  openDrawer: () => set({ open: true }),
  closeDrawer: () => set({ open: false }),
}));
