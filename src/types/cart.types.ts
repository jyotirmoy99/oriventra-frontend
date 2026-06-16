// ---------------------------------------------------------------------------
// Cart types
// ---------------------------------------------------------------------------
// The backend returns a COMPUTED cart view (live prices/availability), not the
// raw document. We use the same `CartLine`/`CartView` shape for the guest
// (localStorage) cart so the UI renders identically in both modes.
// ---------------------------------------------------------------------------

export interface CartLineProduct {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface CartLineVariant {
  size?: string;
  color?: string;
}

export interface CartLine {
  /** Server cart-item id, or `${productId}:${variantId}` for the guest cart. */
  itemId: string;
  /** null when the product was deleted/deactivated after being added. */
  product: CartLineProduct | null;
  variantId?: string;
  variant?: CartLineVariant | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  available: boolean; // product active AND enough stock for the quantity
  availableStock: number;
}

export interface CartView {
  _id: string;
  items: CartLine[];
  subtotal: number; // counts available lines only
  totalItems: number;
}

/**
 * A guest cart line persisted to localStorage. Carries a small product snapshot
 * so the cart renders without a network call; on login only
 * productId/variantId/quantity are sent to the merge endpoint.
 */
export interface GuestCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  name: string;
  slug: string;
  image?: string;
  unitPrice: number;
  size?: string;
  color?: string;
  availableStock: number;
}

/** POST /cart/items body. */
export interface AddItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

/** One entry of POST /cart/merge. */
export interface MergeItem {
  productId: string;
  variantId?: string;
  quantity: number;
}
