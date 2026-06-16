import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { GuestCartItem } from "../../types/cart.types";

// ---------------------------------------------------------------------------
// cartSlice  (GUEST cart — local, for signed-out shoppers)
// ---------------------------------------------------------------------------
// Signed-in users' carts live on the server (React Query, see useCart). Guests
// can't use the auth-only cart API, so their cart lives here and is persisted
// to localStorage (store/index.ts subscribes and saves). On login the guest
// cart is merged into the server cart (mergeGuestCart) and cleared.
// ---------------------------------------------------------------------------

export const GUEST_CART_STORAGE_KEY = "oriventra-guest-cart";

/** Hydrate the guest cart from localStorage at startup. */
function loadGuestCart(): GuestCartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

interface CartState {
  items: GuestCartItem[];
}

const initialState: CartState = { items: loadGuestCart() };

// Same product + variant?
const isSameLine = (
  item: GuestCartItem,
  productId: string,
  variantId?: string,
) =>
  item.productId === productId &&
  (item.variantId ?? "") === (variantId ?? "");

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** Add a line (or increment a matching one), clamped to available stock. */
    addGuestItem(state, action: PayloadAction<GuestCartItem>) {
      const incoming = action.payload;
      const existing = state.items.find((i) =>
        isSameLine(i, incoming.productId, incoming.variantId),
      );
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + incoming.quantity,
          incoming.availableStock,
        );
        // Refresh the snapshot in case price/stock changed since last add.
        existing.unitPrice = incoming.unitPrice;
        existing.availableStock = incoming.availableStock;
      } else {
        state.items.push({
          ...incoming,
          quantity: Math.min(incoming.quantity, incoming.availableStock),
        });
      }
    },
    /** Set a line's quantity (clamped to [1, stock]). */
    setGuestItemQuantity(
      state,
      action: PayloadAction<{ productId: string; variantId?: string; quantity: number }>,
    ) {
      const { productId, variantId, quantity } = action.payload;
      const item = state.items.find((i) => isSameLine(i, productId, variantId));
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.availableStock));
      }
    },
    /** Remove a line. */
    removeGuestItem(
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>,
    ) {
      state.items = state.items.filter(
        (i) => !isSameLine(i, action.payload.productId, action.payload.variantId),
      );
    },
    /** Empty the guest cart (e.g. after merging into the server cart). */
    clearGuestCart(state) {
      state.items = [];
    },
  },
});

export const {
  addGuestItem,
  setGuestItemQuantity,
  removeGuestItem,
  clearGuestCart,
} = cartSlice.actions;

export const selectGuestItems = (state: RootState): GuestCartItem[] =>
  state.cart.items;
export const selectGuestCount = (state: RootState): number =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
