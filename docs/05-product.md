# Feature 5 — Product

The catalog: a **listing page** (`/products`) with a URL-driven filters sidebar,
debounced search, sort, and pagination; and a **detail page**
(`/products/:slug`) with gallery, variant selector, quantity picker, reviews,
and related products.

---

## 1. File map

### Review foundation (read side; write side is Feature 10)
| File | Responsibility |
| --- | --- |
| `src/types/review.types.ts` | `Review`, `ReviewSummary`, list result + query types. |
| `src/services/review.service.ts` | `listProductReviews(productId, params)`. |
| `src/hooks/useReviews.ts` | `useProductReviews` + `reviewKeys`. |

### Listing
| File | Responsibility |
| --- | --- |
| `src/hooks/useProductFilters.ts` | URL ⇆ typed filter state; derives `apiParams`; `update`/`reset`. |
| `src/components/product/ProductFilters.tsx` | Sidebar: category, price, rating, tags, in-stock. |
| `src/components/product/ProductSortSelect.tsx` | Sort dropdown (maps to backend sorts). |
| `src/components/product/ProductGrid.tsx` | Shared grid (skeletons + empty state). |
| `src/pages/products/ProductListPage.tsx` | Composes search + filters + sort + grid + pagination. |

### Detail
| File | Responsibility |
| --- | --- |
| `src/components/product/ProductGallery.tsx` | Main image + thumbnails. |
| `src/components/product/VariantSelector.tsx` | Size/color choices; disables unavailable combos. |
| `src/components/product/QuantityPicker.tsx` | Bounded quantity stepper. |
| `src/components/product/ReviewsSection.tsx` | Rating summary + sortable, paginated reviews (read-only). |
| `src/components/product/RelatedProducts.tsx` | Same-category products, current excluded. |
| `src/pages/products/ProductDetailPage.tsx` | Gallery + buy box + description + reviews + related. |

(Routes added to `lazyPages.ts` + `router.tsx`; `ProductCard` from Feature 4 is reused.)

---

## 2. Filters & URL state

The query string **is** the filter state (shareable / bookmarkable / back-button
friendly). `useProductFilters` parses it into `ProductFiltersState`, derives the
backend `ProductListParams`, and writes changes back (with `replace`). Any filter
change resets to page 1.

Mapping to backend support:

| Filter | Server-side? | Notes |
| --- | --- | --- |
| search | ✅ `search` | Debounced (400ms), wrapped in `useTransition`. |
| category | ✅ `category` (slug) | Radio list from `useCategories`. |
| price min/max | ✅ `minPrice`/`maxPrice` | Commit on blur / Enter. |
| tags | ✅ `tags` (csv) | Suggestions derived from the current page's products. |
| in stock | ✅ `inStock` | Switch. |
| rating | ✅ `minRating` | "N★ & up" → `minRating=N` (added to the backend product query; paginates correctly). |
| sort | ✅ `sort` | `newest/oldest/price_asc/price_desc/rating/name`. |

---

## 3. Detail page mechanics

- **Route param is the slug**, but `useProduct` (and the backend) accept id *or*
  slug, so both resolve.
- **Variants**: sizes/colors are derived from `product.variants`. A value is
  disabled when no in-stock variant offers it given the other selection. Once the
  required dimensions are chosen, the matching variant sets the effective
  **price** and **stock**; "Add to cart" is disabled until selection is complete
  and stock > 0.
- **Reviews**: the endpoint needs the product's `_id`, so the page fetches the
  product first, then passes `product._id` to `ReviewsSection`.
- **Related**: fetched by `product.category.slug`, current product filtered out.

---

## 4. How to test it

1. `npm run dev` → `/products` (or click "Shop"/"Shop now" / a category tile / the
   navbar search).
2. **Filters**: pick a category, set a price range (blur/Enter), toggle tags and
   "In stock only" → URL updates and results refetch. Copy the URL to a new tab —
   the same filtered view loads.
3. **Search**: type in the toolbar search → debounced; the list updates without a
   full reload (and the navbar search still works and syncs the box).
4. **Sort** and **paginate** (when >1 page and no rating filter).
5. **Rating filter**: pick "3★ & up" → refines the current page (note the helper
   text; pagination hides).
6. **Mobile** (<900px): the sidebar moves into a "Filters" drawer.
7. **Detail**: click a card → gallery (swap thumbnails), pick size/color, change
   quantity, Add to cart (toast + badge), wishlist heart, click a tag → filtered
   listing, scroll to **reviews** (sort/paginate) and **related products**.

---

## 5. Flags / decisions

- **Rating filter is server-side**: added a `minRating` param to the backend
  (`productQuerySchema` + listing service `ratingAverage: { $gte }`). The frontend
  maps the sidebar's "N★ & up" to `minRating`, so it filters across the whole
  catalog and paginates correctly.
- **Tag suggestions come from the current page** (there's no "all tags"
  endpoint). Selected tags persist in the URL regardless.
- **Add-to-cart doesn't yet carry the selected variant** — the minimal cart
  (Feature 6) ignores it; the detail page already captures the variant/quantity
  so Feature 6 just consumes them.
- **Reviews are read-only** here; create/edit/delete arrive in Feature 10.
- Needs **seeded products** (active, ideally with variants/images/reviews) to look
  complete.

## 6. External setup required
None.
