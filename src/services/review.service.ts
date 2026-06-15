import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";
import type {
  ReviewListResult,
  ReviewQueryParams,
} from "../types/review.types";

// ---------------------------------------------------------------------------
// review.service
// ---------------------------------------------------------------------------
// Public review listing for a product. `productId` must be the Mongo _id (the
// endpoint validates it), so callers pass product._id (not the slug).
// Create/update/delete arrive with Feature 10.
// ---------------------------------------------------------------------------

/** GET /reviews/product/:productId — reviews + pagination + rating summary. */
export async function listProductReviews(
  productId: string,
  params: ReviewQueryParams = {},
): Promise<ReviewListResult> {
  const { data } = await axiosInstance.get<ApiResponse<ReviewListResult>>(
    `/reviews/product/${productId}`,
    { params },
  );
  return data.data!;
}
