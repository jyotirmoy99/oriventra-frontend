import { useCallback, useOptimistic, useTransition } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import {
  selectWishlistIds,
  toggleWishlist,
} from "../features/wishlist/wishlistSlice";

// ---------------------------------------------------------------------------
// useWishlistToggle  (React 19 useOptimistic + useTransition — rules (i),(j))
// ---------------------------------------------------------------------------
// Returns the wishlist membership of a product plus a toggle that flips the
// heart instantly (optimistically) and commits to the store. Today the commit
// is local (wishlist slice). Feature 9 will, inside the same transition, also
// persist to the server and revert the optimistic value on failure — callers
// (ProductCard) won't need to change.
// ---------------------------------------------------------------------------

export function useWishlistToggle(productId: string) {
  const dispatch = useAppDispatch();
  const ids = useAppSelector(selectWishlistIds);
  const isWishlisted = ids.includes(productId);

  // Optimistic mirror of the membership boolean.
  const [optimistic, setOptimistic] = useOptimistic(isWishlisted);
  const [isPending, startTransition] = useTransition();

  const toggle = useCallback(() => {
    startTransition(() => {
      setOptimistic(!isWishlisted); // flip the heart immediately
      dispatch(toggleWishlist(productId)); // commit (server sync in F9)
    });
  }, [dispatch, isWishlisted, productId, setOptimistic]);

  return { isWishlisted: optimistic, toggle, isPending };
}
