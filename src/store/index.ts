import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    // Global UI state only — server data lives in TanStack Query.
    auth: authReducer,
    cart: cartReducer, // Navbar badge for now; full cart in Feature 6
    wishlist: wishlistReducer, // Navbar badge for now; full wishlist in Feature 9
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
