// ---------------------------------------------------------------------------
// Product & catalog types (mirror the backend product module)
// ---------------------------------------------------------------------------
// On product responses the backend POPULATES `category` with just name + slug
// (see product service `.populate("category", "name slug")`), so it's a small
// ref object, not the full Category.
// ---------------------------------------------------------------------------

export interface ProductImage {
  url: string;
  publicId: string;
}

/** A purchasable size/color combo with its own stock (and optional price). */
export interface ProductVariant {
  _id: string;
  size?: string;
  color?: string;
  sku?: string;
  price?: number; // falls back to the product's base price when unset
  stock: number;
}

/** Slim category reference embedded in product responses. */
export interface ProductCategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  category: ProductCategoryRef;
  tags: string[];

  price: number; // base price
  compareAtPrice?: number; // optional "was" price for showing discounts

  images: ProductImage[];
  variants: ProductVariant[];

  stock: number;
  sku?: string;

  isActive: boolean;
  isFeatured: boolean;

  ratingAverage: number;
  ratingCount: number;

  createdAt: string;
  updatedAt: string;
}

/** Sort keys accepted by GET /products (must match backend PRODUCT_SORTS). */
export type ProductSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "name";

/** Query params for the product listing endpoint. */
export interface ProductListParams {
  search?: string;
  category?: string; // id OR slug
  tags?: string; // comma-separated
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  minRating?: number; // average rating ≥ this value
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

/** Pagination block returned alongside a product list. */
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/** `data` shape from GET /products. */
export interface ProductListResult {
  products: Product[];
  pagination: Pagination;
}
