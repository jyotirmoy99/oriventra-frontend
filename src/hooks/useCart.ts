import { useCallback } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { incrementCartCount } from "../features/cart/cartSlice";
import { useSnackbar } from "./useSnackbar";
import type { Product } from "../types/product.types";

// ---------------------------------------------------------------------------
// useAddToCart  (minimal — full cart in Feature 6)
// ---------------------------------------------------------------------------
// A hook boundary so ProductCard can call `addToCart(product)` today and stay
// unchanged when Feature 6 replaces the internals with real line-item state +
// server sync (and optimistic updates). For now it bumps the Navbar badge and
// confirms with a toast.
// ---------------------------------------------------------------------------

export function useAddToCart() {
  const dispatch = useAppDispatch();
  const { notify } = useSnackbar();

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      dispatch(incrementCartCount(quantity));
      notify(`${product.name} added to cart`, "success");
    },
    [dispatch, notify],
  );

  return { addToCart };
}
