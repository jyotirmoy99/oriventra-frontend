import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";
import type {
  Product,
  ProductInput,
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

// --- Admin CRUD ------------------------------------------------------------

/** POST /products (admin). */
export async function createProduct(payload: ProductInput): Promise<Product> {
  const { data } = await axiosInstance.post<ApiResponse<{ product: Product }>>(
    "/products",
    payload,
  );
  return data.data!.product;
}

/** PATCH /products/:id (admin). */
export async function updateProduct(
  id: string,
  payload: Partial<ProductInput>,
): Promise<Product> {
  const { data } = await axiosInstance.patch<ApiResponse<{ product: Product }>>(
    `/products/${id}`,
    payload,
  );
  return data.data!.product;
}

/** DELETE /products/:id (admin). */
export async function deleteProduct(id: string): Promise<void> {
  await axiosInstance.delete(`/products/${id}`);
}

/** POST /products/:id/images (admin, multipart "images", up to 6). */
export async function uploadProductImages(
  id: string,
  files: File[],
): Promise<Product> {
  const form = new FormData();
  files.forEach((file) => form.append("images", file));
  const { data } = await axiosInstance.post<ApiResponse<{ product: Product }>>(
    `/products/${id}/images`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data!.product;
}

/** DELETE /products/:id/images (admin) — remove one image by publicId. */
export async function removeProductImage(
  id: string,
  publicId: string,
): Promise<Product> {
  const { data } = await axiosInstance.delete<ApiResponse<{ product: Product }>>(
    `/products/${id}/images`,
    { data: { publicId } },
  );
  return data.data!.product;
}
