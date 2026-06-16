import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";
import type { Category } from "../types/category.types";

// ---------------------------------------------------------------------------
// category.service
// ---------------------------------------------------------------------------
// Wrappers over the public /categories endpoints.
// ---------------------------------------------------------------------------

/** GET /categories — all active categories. */
export async function listCategories(): Promise<Category[]> {
  const { data } = await axiosInstance.get<
    ApiResponse<{ categories: Category[] }>
  >("/categories");
  return data.data!.categories;
}

/** GET /categories/:idOrSlug — single category by id or slug. */
export async function getCategory(idOrSlug: string): Promise<Category> {
  const { data } = await axiosInstance.get<ApiResponse<{ category: Category }>>(
    `/categories/${idOrSlug}`,
  );
  return data.data!.category;
}
