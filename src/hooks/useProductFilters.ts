import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductListParams, ProductSort } from "../types/product.types";

// ---------------------------------------------------------------------------
// useProductFilters
// ---------------------------------------------------------------------------
// The URL query string is the single source of truth for the listing's filters
// (so a filtered view is shareable/bookmarkable and survives refresh/back). This
// hook parses the params into a typed state, derives the API query
// (`ProductListParams`), and exposes updaters that write back to the URL.
//
// `rating` (0 = any) maps to the backend's `minRating` param, so rating
// filtering is server-side and paginates correctly.
// ---------------------------------------------------------------------------

export const DEFAULT_SORT: ProductSort = "newest";
export const PAGE_SIZE = 12;

export interface ProductFiltersState {
  search: string;
  category: string; // slug
  tags: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  rating: number; // 0 = any (client-side)
  sort: ProductSort;
  page: number;
}

const num = (v: string | null): number | undefined => {
  if (v === null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse the URL → typed filter state.
  const filters: ProductFiltersState = useMemo(() => {
    const tagsRaw = searchParams.get("tags") ?? "";
    return {
      search: searchParams.get("search") ?? "",
      category: searchParams.get("category") ?? "",
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
      minPrice: num(searchParams.get("minPrice")),
      maxPrice: num(searchParams.get("maxPrice")),
      inStock: searchParams.get("inStock") === "true",
      rating: num(searchParams.get("rating")) ?? 0,
      sort: (searchParams.get("sort") as ProductSort) || DEFAULT_SORT,
      page: num(searchParams.get("page")) ?? 1,
    };
  }, [searchParams]);

  // Derive the server query. `rating > 0` becomes `minRating`.
  const apiParams: ProductListParams = useMemo(
    () => ({
      search: filters.search || undefined,
      category: filters.category || undefined,
      tags: filters.tags.length ? filters.tags.join(",") : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock || undefined,
      minRating: filters.rating > 0 ? filters.rating : undefined,
      sort: filters.sort,
      page: filters.page,
      limit: PAGE_SIZE,
    }),
    [filters],
  );

  /**
   * Merge a partial update into the URL. Any change other than `page` resets to
   * page 1 (so you never land on an out-of-range page after narrowing results).
   */
  const update = useCallback(
    (patch: Partial<ProductFiltersState>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          const setParam = (key: string, value: string | undefined) => {
            if (value === undefined || value === "") next.delete(key);
            else next.set(key, value);
          };

          if ("search" in patch) setParam("search", patch.search);
          if ("category" in patch) setParam("category", patch.category);
          if ("tags" in patch)
            setParam("tags", patch.tags?.length ? patch.tags.join(",") : undefined);
          if ("minPrice" in patch)
            setParam("minPrice", patch.minPrice?.toString());
          if ("maxPrice" in patch)
            setParam("maxPrice", patch.maxPrice?.toString());
          if ("inStock" in patch)
            setParam("inStock", patch.inStock ? "true" : undefined);
          if ("rating" in patch)
            setParam("rating", patch.rating ? String(patch.rating) : undefined);
          if ("sort" in patch)
            setParam("sort", patch.sort === DEFAULT_SORT ? undefined : patch.sort);

          // Page: explicit in patch wins; otherwise any other change resets to 1.
          if ("page" in patch) setParam("page", patch.page && patch.page > 1 ? String(patch.page) : undefined);
          else next.delete("page");

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  /** Clear every filter (keeps you on /products). */
  const reset = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  /** Whether any filter (other than sort/page) is active — drives the "Clear" UI. */
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    filters.tags.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock ||
    filters.rating > 0;

  return { filters, apiParams, update, reset, hasActiveFilters };
}
