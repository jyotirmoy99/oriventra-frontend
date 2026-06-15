import { useQuery } from "@tanstack/react-query";
import * as categoryService from "../services/category.service";

// ---------------------------------------------------------------------------
// Category query hooks
// ---------------------------------------------------------------------------

export const categoryKeys = {
  all: ["categories"] as const,
  detail: (idOrSlug: string) => [...categoryKeys.all, idOrSlug] as const,
};

/** All categories. Cached longer since they change rarely. */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoryService.listCategories(),
    staleTime: 1000 * 60 * 30, // 30 min
  });
}
