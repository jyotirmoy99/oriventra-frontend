import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";
import type {
  Product,
  ProductListParams,
  ProductListResult,
} from "../types/product.types";

// ---------------------------------------------------------------------------
// product.service
// ---------------------------------------------------------------------------
// Wrappers over the public /products endpoints. Axios serializes `params` into
// the query string and omits `undefined` values, so callers pass only the
// filters they care about. Booleans become "true"/"false" strings, which the
// backend's query schema expects.
// ---------------------------------------------------------------------------

/** GET /products — search / filter / sort / paginate. */
export async function listProducts(
  params: ProductListParams = {},
): Promise<ProductListResult> {
  const { data } = await axiosInstance.get<ApiResponse<ProductListResult>>(
    "/products",
    { params },
  );
  return data.data!;
}

/** GET /products/:idOrSlug — single product by Mongo id or slug. */
export async function getProduct(idOrSlug: string): Promise<Product> {
  const { data } = await axiosInstance.get<ApiResponse<{ product: Product }>>(
    `/products/${idOrSlug}`,
  );
  return data.data!.product;
}
