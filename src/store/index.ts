import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer, {
  GUEST_CART_STORAGE_KEY,
} from "../features/cart/cartSlice";
import wishlistReducer, {
  GUEST_WISHLIST_STORAGE_KEY,
} from "../features/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    // Global UI state only — server data lives in TanStack Query.
    auth: authReducer,
    cart: cartReducer, // guest cart (signed-in carts are server-side)
    wishlist: wishlistReducer, // Navbar badge for now; full wishlist in Feature 9
  },
});

// Persist the guest cart + wishlist to localStorage whenever they change (only
// writes when the items reference actually changes, so it's cheap).
let lastCartItems = store.getState().cart.items;
let lastWishlistItems = store.getState().wishlist.items;
store.subscribe(() => {
  const state = store.getState();
  if (state.cart.items !== lastCartItems) {
    lastCartItems = state.cart.items;
    try {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(lastCartItems));
    } catch {
      // Ignore quota/serialization errors — cart still works in-memory.
    }
  }
  if (state.wishlist.items !== lastWishlistItems) {
    lastWishlistItems = state.wishlist.items;
    try {
      localStorage.setItem(
        GUEST_WISHLIST_STORAGE_KEY,
        JSON.stringify(lastWishlistItems),
      );
    } catch {
      // Ignore — wishlist still works in-memory.
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
