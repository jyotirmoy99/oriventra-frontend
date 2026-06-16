import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { WishlistItem } from "../../types/wishlist.types";

// ---------------------------------------------------------------------------
// wishlistSlice  (GUEST wishlist — local, for signed-out shoppers)
// ---------------------------------------------------------------------------
// Signed-in users' wishlists live on the server (React Query, see useWishlist).
// Guests keep theirs here as product snapshots (so the wishlist page renders
// without a fetch), persisted to localStorage. On login the guest wishlist is
// merged into the server wishlist (mergeGuestWishlist) and cleared.
// ---------------------------------------------------------------------------

export const GUEST_WISHLIST_STORAGE_KEY = "oriventra-guest-wishlist";

function loadGuestWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = { items: loadGuestWishlist() };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /** Add if absent, remove if present (the heart toggle). */
    toggleGuestWishlist(state, action: PayloadAction<WishlistItem>) {
      const id = action.payload.productId;
      const exists = state.items.some((i) => i.productId === id);
      state.items = exists
        ? state.items.filter((i) => i.productId !== id)
        : [...state.items, action.payload];
    },
    removeGuestWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearGuestWishlist(state) {
      state.items = [];
    },
  },
});

export const {
  toggleGuestWishlist,
  removeGuestWishlistItem,
  clearGuestWishlist,
} = wishlistSlice.actions;

export const selectGuestWishlistItems = (state: RootState): WishlistItem[] =>
  state.wishlist.items;
export const selectGuestWishlistCount = (state: RootState): number =>
  state.wishlist.items.length;

export default wishlistSlice.reducer;
