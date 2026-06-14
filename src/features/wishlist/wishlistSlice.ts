import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// ---------------------------------------------------------------------------
// wishlistSlice  (minimal — Navbar badge + quick membership checks)
// ---------------------------------------------------------------------------
// Feature 9 (Wishlist page) builds the full experience with React 19
// useOptimistic toggles synced to the server. For Feature 2 we keep a set of
// product IDs so the Navbar badge can show a count and product cards can later
// check membership cheaply.
// ---------------------------------------------------------------------------

interface WishlistState {
  /** Product IDs currently in the wishlist. */
  ids: string[];
}

const initialState: WishlistState = {
  ids: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /** Replace the whole wishlist (e.g. after fetching it from the server). */
    setWishlist(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },
    /** Add/remove a single product ID. */
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((existing) => existing !== id)
        : [...state.ids, id];
    },
  },
});

export const { setWishlist, toggleWishlist } = wishlistSlice.actions;

export const selectWishlistCount = (state: RootState): number =>
  state.wishlist.ids.length;
export const selectWishlistIds = (state: RootState): string[] =>
  state.wishlist.ids;

export default wishlistSlice.reducer;
