import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as categoryService from "../services/category.service";
import type { CategoryInput } from "../types/category.types";

// ---------------------------------------------------------------------------
// Category query hooks
// ---------------------------------------------------------------------------

export const categoryKeys = {
  all: ["categories"] as const,
  admin: ["categories", "admin"] as const,
  detail: (idOrSlug: string) => [...categoryKeys.all, idOrSlug] as const,
};

/** Active categories (storefront). Cached longer since they change rarely. */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoryService.listCategories(),
    staleTime: 1000 * 60 * 30, // 30 min
  });
}

/** All categories incl. inactive — admin management screens. */
export function useAdminCategories() {
  return useQuery({
    queryKey: categoryKeys.admin,
    queryFn: () => categoryService.listCategories(true),
  });
}

// Category writes invalidate both the public list and the admin list.
function useCategoryInvalidation() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
}

export function useCreateCategory() {
  const invalidate = useCategoryInvalidation();
  return useMutation({
    mutationFn: (payload: CategoryInput) =>
      categoryService.createCategory(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useCategoryInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CategoryInput> }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useCategoryInvalidation();
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: invalidate,
  });
}

export function useUploadCategoryImage() {
  const invalidate = useCategoryInvalidation();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      categoryService.uploadCategoryImage(id, file),
    onSuccess: invalidate,
  });
}

export function useRemoveCategoryImage() {
  const invalidate = useCategoryInvalidation();
  return useMutation({
    mutationFn: (id: string) => categoryService.removeCategoryImage(id),
    onSuccess: invalidate,
  });
}
