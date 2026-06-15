import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// ---------------------------------------------------------------------------
// cartSlice  (minimal — Navbar badge only for now)
// ---------------------------------------------------------------------------
// Feature 6 (Cart) expands this into the full cart (items, quantities,
// subtotal, optimistic updates). For Feature 2 we only need the total item
// count to drive the Navbar cart badge, so the slice intentionally holds just
// that. The reducer names are forward-compatible with the full cart.
// ---------------------------------------------------------------------------

interface CartUiState {
  /** Sum of quantities across all cart lines — drives the badge. */
  totalQuantity: number;
}

const initialState: CartUiState = {
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** Replace the badge count (e.g. after syncing the cart from the server). */
    setCartCount(state, action: PayloadAction<number>) {
      state.totalQuantity = Math.max(0, action.payload);
    },
    /** Bump the badge by N (defaults to 1) — used by add-to-cart. */
    incrementCartCount(state, action: PayloadAction<number | undefined>) {
      state.totalQuantity = Math.max(0, state.totalQuantity + (action.payload ?? 1));
    },
  },
});

export const { setCartCount, incrementCartCount } = cartSlice.actions;

export const selectCartCount = (state: RootState): number =>
  state.cart.totalQuantity;

export default cartSlice.reducer;
