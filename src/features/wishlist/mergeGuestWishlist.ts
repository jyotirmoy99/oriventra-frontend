import type { QueryClient } from "@tanstack/react-query";
import { store } from "../../store";
import * as userService from "../../services/user.service";
import { clearGuestWishlist, selectGuestWishlistItems } from "./wishlistSlice";
import { wishlistKeys } from "./wishlistKeys";

// ---------------------------------------------------------------------------
// mergeGuestWishlist
// ---------------------------------------------------------------------------
// On login/register, add each guest-wishlisted product to the server wishlist
// (the backend uses $addToSet, so duplicates are ignored), then clear the guest
// wishlist and refresh the server copy. There's no bulk merge endpoint, so we
// fan out — failures per item are ignored so sign-in is never blocked.
// ---------------------------------------------------------------------------

export async function mergeGuestWishlist(queryClient: QueryClient): Promise<void> {
  const items = selectGuestWishlistItems(store.getState());

  if (items.length > 0) {
    await Promise.allSettled(
      items.map((i) => userService.addToWishlist(i.productId)),
    );
    store.dispatch(clearGuestWishlist());
  }

  await queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
}
