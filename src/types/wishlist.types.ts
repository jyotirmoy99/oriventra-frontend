import type { ProductImage } from "./product.types";

// ---------------------------------------------------------------------------
// Wishlist types
// ---------------------------------------------------------------------------
// The server wishlist GET returns a populated subset of each product. The guest
// wishlist (localStorage) stores a small snapshot so it renders without a fetch
// — same idea as the guest cart.
// ---------------------------------------------------------------------------

/** Populated product returned by GET /users/me/wishlist. */
export interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: ProductImage[];
  ratingAverage: number;
  isActive: boolean;
}

/** Normalized wishlist line used by the UI (server + guest). */
export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  ratingAverage: number;
}
