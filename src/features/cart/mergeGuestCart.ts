import type { QueryClient } from "@tanstack/react-query";
import { store } from "../../store";
import * as cartService from "../../services/cart.service";
import { clearGuestCart, selectGuestItems } from "./cartSlice";
import { cartKeys } from "./cartKeys";

// ---------------------------------------------------------------------------
// mergeGuestCart
// ---------------------------------------------------------------------------
// Called right after login/register: folds the local guest cart into the user's
// server cart (POST /cart/merge), clears the guest cart, then refreshes the
// server cart cache. Merge failures are swallowed — a stale guest cart must
// never block sign-in.
// ---------------------------------------------------------------------------

export async function mergeGuestCart(queryClient: QueryClient): Promise<void> {
  const items = selectGuestItems(store.getState());

  if (items.length > 0) {
    try {
      await cartService.mergeCart(
        items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      );
    } catch {
      // Ignore — never block login on a bad guest cart.
    }
    store.dispatch(clearGuestCart());
  }

  // Pull the authoritative server cart (also primes it for new users).
  await queryClient.invalidateQueries({ queryKey: cartKeys.cart });
}
