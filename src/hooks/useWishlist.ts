import { useCallback, useMemo, useOptimistic, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { useSnackbar } from "./useSnackbar";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import {
  removeGuestWishlistItem,
  selectGuestWishlistCount,
  selectGuestWishlistItems,
  toggleGuestWishlist,
} from "../features/wishlist/wishlistSlice";
import { wishlistKeys } from "../features/wishlist/wishlistKeys";
import * as userService from "../services/user.service";
import { getErrorMessage } from "../utils/getErrorMessage";
import type { Product } from "../types/product.types";
import type { WishlistItem, WishlistProduct } from "../types/wishlist.types";

// ---------------------------------------------------------------------------
// Wishlist (unified guest + server, mirroring the cart)
// ---------------------------------------------------------------------------
//   • signed in  → server wishlist via React Query (GET + toggle endpoints)
//   • signed out → guest wishlist in Redux (persisted to localStorage)
// `useWishlist` powers the wishlist page; `useWishlistToggle` powers the heart
// (React 19 useOptimistic for an instant flip); `useWishlistCount` the badge.
// ---------------------------------------------------------------------------

const wishlistProductToItem = (p: WishlistProduct): WishlistItem => ({
  productId: p._id,
  name: p.name,
  slug: p.slug,
  image: p.images?.[0]?.url,
  price: p.price,
  ratingAverage: p.ratingAverage,
});

/** Build a snapshot from a full product (for the toggle). */
export const productToWishlistItem = (p: Product): WishlistItem => ({
  productId: p._id,
  name: p.name,
  slug: p.slug,
  image: p.images?.[0]?.url,
  price: p.price,
  ratingAverage: p.ratingAverage,
});

/** Server wishlist query (populated products), only when signed in. */
function useServerWishlist() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: userService.getWishlist,
    enabled: isAuthenticated,
  });
}

/** The wishlist page data: normalized items + loading. */
export function useWishlist() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const guestItems = useAppSelector(selectGuestWishlistItems);
  const serverQuery = useServerWishlist();

  const items: WishlistItem[] = useMemo(
    () =>
      isAuthenticated
        ? (serverQuery.data ?? []).map(wishlistProductToItem)
        : guestItems,
    [isAuthenticated, serverQuery.data, guestItems],
  );

  const { remove } = useWishlistMutations();

  return {
    items,
    isLoading: isAuthenticated && serverQuery.isLoading,
    isEmpty: items.length === 0,
    remove,
  };
}

/** Shared add/remove/toggle logic for both modes. */
function useWishlistMutations() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const ids = useWishlistIds();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { notify } = useSnackbar();

  const onIds = () =>
    queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
  const onError = (err: unknown) => notify(getErrorMessage(err), "error");

  const addMutation = useMutation({
    mutationFn: (productId: string) => userService.addToWishlist(productId),
    onSuccess: onIds,
    onError,
  });
  const removeMutation = useMutation({
    mutationFn: (productId: string) => userService.removeFromWishlist(productId),
    onSuccess: onIds,
    onError,
  });

  /** Toggle membership for a product (snapshot used for the guest store). */
  const toggle = useCallback(
    (item: WishlistItem) => {
      const inList = ids.has(item.productId);
      if (isAuthenticated) {
        if (inList) removeMutation.mutate(item.productId);
        else addMutation.mutate(item.productId);
      } else {
        dispatch(toggleGuestWishlist(item));
      }
    },
    [isAuthenticated, ids, addMutation, removeMutation, dispatch],
  );

  /** Remove (used by the wishlist page). */
  const remove = useCallback(
    (productId: string) => {
      if (isAuthenticated) removeMutation.mutate(productId);
      else dispatch(removeGuestWishlistItem(productId));
    },
    [isAuthenticated, removeMutation, dispatch],
  );

  return { toggle, remove };
}

/** Set of wishlisted product ids (server or guest) for membership checks. */
function useWishlistIds(): Set<string> {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const guestItems = useAppSelector(selectGuestWishlistItems);
  const serverQuery = useServerWishlist();
  return useMemo(() => {
    const source = isAuthenticated
      ? (serverQuery.data ?? []).map((p) => p._id)
      : guestItems.map((i) => i.productId);
    return new Set(source);
  }, [isAuthenticated, serverQuery.data, guestItems]);
}

/**
 * Heart toggle for a product. Optimistically flips (React 19 useOptimistic +
 * useTransition) while the server/guest update commits.
 */
export function useWishlistToggle(product?: Product) {
  const ids = useWishlistIds();
  const { toggle } = useWishlistMutations();

  const base = product ? ids.has(product._id) : false;
  const [optimistic, setOptimistic] = useOptimistic(base);
  const [, startTransition] = useTransition();

  const onToggle = useCallback(() => {
    if (!product) return;
    startTransition(() => {
      setOptimistic(!base);
      toggle(productToWishlistItem(product));
    });
  }, [product, base, setOptimistic, toggle]);

  return { isWishlisted: optimistic, toggle: onToggle };
}

/** Wishlist count for the Navbar badge. */
export function useWishlistCount(): number {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const guestCount = useAppSelector(selectGuestWishlistCount);
  const serverQuery = useServerWishlist();
  return isAuthenticated ? serverQuery.data?.length ?? 0 : guestCount;
}
