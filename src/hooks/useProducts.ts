import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as productService from "../services/product.service";
import type { ProductListParams } from "../types/product.types";

// ---------------------------------------------------------------------------
// Product query hooks (server state via TanStack Query — rule (b))
// ---------------------------------------------------------------------------

/** Stable, structured query keys so lists/details can be invalidated precisely. */
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductListParams) =>
    [...productKeys.lists(), params] as const,
  detail: (idOrSlug: string) =>
    [...productKeys.all, "detail", idOrSlug] as const,
};

/**
 * Paginated/filtered product list. `keepPreviousData` keeps the old page
 * visible while the next page/filter loads (no flash of empty state) — used by
 * the listing page in Feature 5; the Home featured grid uses the wrapper below.
 */
export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.listProducts(params),
    placeholderData: keepPreviousData,
  });
}

/** Featured products for the Home grid (highest-rated first). */
export function useFeaturedProducts(limit = 8) {
  return useProducts({ isFeatured: true, sort: "rating", limit });
}

/** Single product by id or slug (used by the detail page in Feature 5). */
export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: productKeys.detail(idOrSlug),
    queryFn: () => productService.getProduct(idOrSlug),
    enabled: Boolean(idOrSlug),
  });
}
