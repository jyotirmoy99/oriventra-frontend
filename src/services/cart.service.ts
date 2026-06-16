import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";
import type {
  AddItemPayload,
  CartView,
  MergeItem,
} from "../types/cart.types";

// ---------------------------------------------------------------------------
// cart.service
// ---------------------------------------------------------------------------
// Server cart endpoints (all auth-only). Each returns the recomputed CartView.
// Guest carts are handled locally (cartSlice) and folded in via mergeCart on
// login.
// ---------------------------------------------------------------------------

type CartResponse = ApiResponse<{ cart: CartView }>;

/** GET /cart — the current user's cart (created empty if none). */
export async function getCart(): Promise<CartView> {
  const { data } = await axiosInstance.get<CartResponse>("/cart");
  return data.data!.cart;
}

/** POST /cart/items — add (or increment) a line. */
export async function addItem(payload: AddItemPayload): Promise<CartView> {
  const { data } = await axiosInstance.post<CartResponse>("/cart/items", payload);
  return data.data!.cart;
}

/** PATCH /cart/items/:itemId — set a line's quantity. */
export async function updateItem(
  itemId: string,
  quantity: number,
): Promise<CartView> {
  const { data } = await axiosInstance.patch<CartResponse>(
    `/cart/items/${itemId}`,
    { quantity },
  );
  return data.data!.cart;
}

/** DELETE /cart/items/:itemId — remove a line. */
export async function removeItem(itemId: string): Promise<CartView> {
  const { data } = await axiosInstance.delete<CartResponse>(
    `/cart/items/${itemId}`,
  );
  return data.data!.cart;
}

/** DELETE /cart — empty the cart. */
export async function clearCart(): Promise<CartView> {
  const { data } = await axiosInstance.delete<CartResponse>("/cart");
  return data.data!.cart;
}

/** POST /cart/merge — fold a guest cart into the user's cart after login. */
export async function mergeCart(items: MergeItem[]): Promise<CartView> {
  const { data } = await axiosInstance.post<CartResponse>("/cart/merge", {
    items,
  });
  return data.data!.cart;
}
