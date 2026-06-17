import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { useSnackbar } from "./useSnackbar";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import {
  addGuestItem,
  clearGuestCart,
  removeGuestItem,
  selectGuestCount,
  selectGuestItems,
  setGuestItemQuantity,
} from "../features/cart/cartSlice";
import { cartKeys } from "../features/cart/cartKeys";
import * as cartService from "../services/cart.service";
import { getErrorMessage } from "../utils/getErrorMessage";
import type {
  CartLine,
  CartView,
  GuestCartItem,
} from "../types/cart.types";
import type { Product, ProductVariant } from "../types/product.types";

// ---------------------------------------------------------------------------
// useCart  (unified guest + server cart)
// ---------------------------------------------------------------------------
// One API for the whole app regardless of auth:
//   • signed in  → server cart via React Query (mutations re-prime the cache)
//   • signed out → guest cart in Redux (persisted to localStorage)
// Components never branch on auth; they call addToCart / updateQuantity /
// removeItem / clear and read items/subtotal/totalItems.
// ---------------------------------------------------------------------------

const EMPTY_CART: CartView = { _id: "guest", items: [], subtotal: 0, totalItems: 0 };

/** Map a guest line to the shared CartLine shape used by the UI. */
function guestItemToLine(i: GuestCartItem): CartLine {
  return {
    itemId: `${i.productId}:${i.variantId ?? ""}`,
    product: { _id: i.productId, name: i.name, slug: i.slug, image: i.image },
    variantId: i.variantId,
    variant: i.size || i.color ? { size: i.size, color: i.color } : null,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    lineTotal: i.unitPrice * i.quantity,
    available: i.availableStock >= i.quantity,
    availableStock: i.availableStock,
  };
}

function buildGuestView(items: GuestCartItem[]): CartView {
  const lines = items.map(guestItemToLine);
  return {
    _id: "guest",
    items: lines,
    subtotal: lines
      .filter((l) => l.available)
      .reduce((sum, l) => sum + l.lineTotal, 0),
    totalItems: lines.reduce((sum, l) => sum + l.quantity, 0),
  };
}

export function useCart() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const guestItems = useAppSelector(selectGuestItems);
  const dispatch = useAppDispatch();
  const { notify } = useSnackbar();
  const queryClient = useQueryClient();

  // Server cart — only fetched when signed in.
  const cartQuery = useQuery({
    queryKey: cartKeys.cart,
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });

  // Mutation handlers re-prime the cache from the server's recomputed cart.
  const onCart = (cart: CartView) => queryClient.setQueryData(cartKeys.cart, cart);
  const onError = (err: unknown) => notify(getErrorMessage(err), "error");

  const addMutation = useMutation({ mutationFn: cartService.addItem, onSuccess: onCart, onError });
  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: onCart,
    onError,
  });
  const removeMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: onCart,
    onError,
  });
  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: onCart,
    onError,
  });

  const view = isAuthenticated ? cartQuery.data ?? EMPTY_CART : buildGuestView(guestItems);

  const addToCart = useCallback(
    (product: Product, variant?: ProductVariant, quantity = 1) => {
      if (isAuthenticated) {
        addMutation.mutate(
          { productId: product._id, variantId: variant?._id, quantity },
          { onSuccess: () => notify(`${product.name} added to cart`, "success") },
        );
      } else {
        const stock = variant ? variant.stock : product.stock;
        dispatch(
          addGuestItem({
            productId: product._id,
            variantId: variant?._id,
            quantity,
            name: product.name,
            slug: product.slug,
            image: product.images[0]?.url,
            unitPrice: variant?.price ?? product.price,
            size: variant?.size,
            color: variant?.color,
            availableStock: stock,
          }),
        );
        notify(`${product.name} added to cart`, "success");
      }
    },
    [isAuthenticated, addMutation, dispatch, notify],
  );

  // Returns a promise that settles only once the cart is updated, so callers
  // (CartItemRow's useOptimistic transition) can keep the optimistic quantity
  // pinned until the server's recomputed cart lands — no revert-then-reapply
  // flicker. The mutation's onError already surfaces the message, so we swallow
  // the rejection here to avoid an unhandled promise rejection in the transition.
  const updateQuantity = useCallback(
    async (line: CartLine, quantity: number): Promise<void> => {
      if (isAuthenticated) {
        try {
          await updateMutation.mutateAsync({ itemId: line.itemId, quantity });
        } catch {
          /* error already surfaced via the mutation's onError */
        }
      } else {
        dispatch(
          setGuestItemQuantity({
            productId: line.product?._id ?? "",
            variantId: line.variantId,
            quantity,
          }),
        );
      }
    },
    [isAuthenticated, updateMutation, dispatch],
  );

  const removeItem = useCallback(
    (line: CartLine) => {
      if (isAuthenticated) removeMutation.mutate(line.itemId);
      else
        dispatch(
          removeGuestItem({
            productId: line.product?._id ?? "",
            variantId: line.variantId,
          }),
        );
    },
    [isAuthenticated, removeMutation, dispatch],
  );

  const clear = useCallback(() => {
    if (isAuthenticated) clearMutation.mutate();
    else dispatch(clearGuestCart());
  }, [isAuthenticated, clearMutation, dispatch]);

  return {
    items: view.items,
    subtotal: view.subtotal,
    totalItems: view.totalItems,
    isAuthenticated,
    isLoading: isAuthenticated && cartQuery.isLoading,
    isMutating:
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending ||
      clearMutation.isPending,
    addToCart,
    updateQuantity,
    removeItem,
    clear,
  };
}

/**
 * Lightweight cart count for the Navbar badge. Shares the server cart query key
 * with useCart (so it's deduped/cached), without creating the mutation set.
 */
export function useCartCount(): number {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const guestCount = useAppSelector(selectGuestCount);
  const cartQuery = useQuery({
    queryKey: cartKeys.cart,
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });
  return isAuthenticated ? cartQuery.data?.totalItems ?? 0 : guestCount;
}
