import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer, {
  GUEST_CART_STORAGE_KEY,
} from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    // Global UI state only — server data lives in TanStack Query.
    auth: authReducer,
    cart: cartReducer, // guest cart (signed-in carts are server-side)
    wishlist: wishlistReducer, // Navbar badge for now; full wishlist in Feature 9
  },
});

// Persist the guest cart to localStorage whenever it changes (only writes when
// the items reference actually changes, so it's cheap).
let lastCartItems = store.getState().cart.items;
store.subscribe(() => {
  const items = store.getState().cart.items;
  if (items !== lastCartItems) {
    lastCartItems = items;
    try {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota/serialization errors — cart still works in-memory.
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
