import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";
import type { Category, CategoryInput } from "../types/category.types";

// ---------------------------------------------------------------------------
// category.service
// ---------------------------------------------------------------------------
// Wrappers over the /categories endpoints (public reads + admin CRUD).
// ---------------------------------------------------------------------------

/**
 * GET /categories — categories sorted by name. By default only active ones are
 * returned; pass includeInactive (admin) to get the full set.
 */
export async function listCategories(
  includeInactive = false,
): Promise<Category[]> {
  const { data } = await axiosInstance.get<
    ApiResponse<{ categories: Category[] }>
  >("/categories", {
    params: includeInactive ? { all: "true" } : undefined,
  });
  return data.data!.categories;
}

/** GET /categories/:idOrSlug — single category by id or slug. */
export async function getCategory(idOrSlug: string): Promise<Category> {
  const { data } = await axiosInstance.get<ApiResponse<{ category: Category }>>(
    `/categories/${idOrSlug}`,
  );
  return data.data!.category;
}

// --- Admin CRUD ------------------------------------------------------------

/** POST /categories (admin). */
export async function createCategory(payload: CategoryInput): Promise<Category> {
  const { data } = await axiosInstance.post<ApiResponse<{ category: Category }>>(
    "/categories",
    payload,
  );
  return data.data!.category;
}

/** PATCH /categories/:id (admin). */
export async function updateCategory(
  id: string,
  payload: Partial<CategoryInput>,
): Promise<Category> {
  const { data } = await axiosInstance.patch<ApiResponse<{ category: Category }>>(
    `/categories/${id}`,
    payload,
  );
  return data.data!.category;
}

/** DELETE /categories/:id (admin). */
export async function deleteCategory(id: string): Promise<void> {
  await axiosInstance.delete(`/categories/${id}`);
}

/** POST /categories/:id/image (admin, multipart "image"). */
export async function uploadCategoryImage(
  id: string,
  file: File,
): Promise<Category> {
  const form = new FormData();
  form.append("image", file);
  const { data } = await axiosInstance.post<ApiResponse<{ category: Category }>>(
    `/categories/${id}/image`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data!.category;
}

/** DELETE /categories/:id/image (admin) — remove the category image. */
export async function removeCategoryImage(id: string): Promise<Category> {
  const { data } = await axiosInstance.delete<ApiResponse<{ category: Category }>>(
    `/categories/${id}/image`,
  );
  return data.data!.category;
}
