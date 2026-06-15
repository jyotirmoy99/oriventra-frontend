import type { Avatar } from "./index";
import type { Pagination } from "./product.types";

// ---------------------------------------------------------------------------
// Review types (mirror the backend review module)
// ---------------------------------------------------------------------------
// On list responses `user` is populated with just name + avatar.
// ---------------------------------------------------------------------------

export interface ReviewUser {
  _id: string;
  name: string;
  avatar?: Avatar;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  product: string;
  rating: number; // 1..5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReviewSort = "newest" | "highest" | "lowest";

/** Query params for GET /reviews/product/:productId. */
export interface ReviewQueryParams {
  rating?: number; // filter by exact stars
  sort?: ReviewSort;
  page?: number;
  limit?: number;
}

/** Aggregate rating block returned alongside the list. */
export interface ReviewSummary {
  ratingAverage: number;
  ratingCount: number;
}

/** `data` shape from GET /reviews/product/:productId. */
export interface ReviewListResult {
  reviews: Review[];
  pagination: Pagination;
  summary: ReviewSummary;
}
