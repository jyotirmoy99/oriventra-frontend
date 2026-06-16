# Feature 4 — Home

The storefront landing page — **Hero** (Framer Motion), **Categories**,
**Featured products**, **Promo banners**, and **Newsletter** — plus the shared
product/catalog foundation (types, services, query hooks, `ProductCard`) reused
by Feature 5, and a global **toast** system.

---

## 1. File map

### Catalog foundation (shared with Feature 5)
| File | Responsibility |
| --- | --- |
| `src/types/product.types.ts` | `Product`, `ProductVariant`, `ProductCategoryRef`, list params/result, `Pagination`. |
| `src/types/category.types.ts` | `Category`. |
| `src/services/product.service.ts` | `listProducts(params)`, `getProduct(idOrSlug)`. |
| `src/services/category.service.ts` | `listCategories()`, `getCategory(idOrSlug)`. |
| `src/hooks/useProducts.ts` | `useProducts`, `useFeaturedProducts`, `useProduct` + `productKeys`. |
| `src/hooks/useCategories.ts` | `useCategories` + `categoryKeys`. |
| `src/utils/formatCurrency.ts` | `formatCurrency` (USD) + `discountPercent`. |

### Product card (shared)
| File | Responsibility |
| --- | --- |
| `src/components/product/ProductCard.tsx` | Image, price/discount, rating, wishlist heart, add-to-cart. |
| `src/components/product/ProductCardSkeleton.tsx` | Matching loading placeholder. |
| `src/hooks/useWishlist.ts` | `useWishlistToggle` — React 19 `useOptimistic` + `useTransition`. |
| `src/hooks/useCart.ts` | `useAddToCart` — minimal (badge + toast) until Feature 6. |

### Global toast
| File | Responsibility |
| --- | --- |
| `src/components/common/SnackbarContext.ts` | Context + `notify` type. |
| `src/components/common/SnackbarProvider.tsx` | App-wide MUI Snackbar; mounted in `providers.tsx`. |
| `src/hooks/useSnackbar.ts` | `useSnackbar()` accessor. |

### Home sections
| File | Responsibility |
| --- | --- |
| `src/components/home/HeroSection.tsx` | Gradient hero, staggered Framer Motion entrance, CTAs. |
| `src/components/home/SectionHeading.tsx` | Reusable title + "view all" row. |
| `src/components/home/CategoriesSection.tsx` | Category tiles (`useCategories`). |
| `src/components/home/FeaturedProducts.tsx` | Featured grid (`useFeaturedProducts`). |
| `src/components/home/PromoBanners.tsx` | Two static promo cards (scroll-in animation). |
| `src/components/home/Newsletter.tsx` | Email capture (RHF + Zod). |
| `src/validations/newsletter.schema.ts` | Newsletter Zod schema. |
| `src/pages/HomePage.tsx` | Composes the five sections. |

---

## 2. API contracts used

- `GET /products` → `{ data: { products, pagination: { total, page, limit, pages } } }`.
  Query params: `search, category, tags, brand, minPrice, maxPrice, inStock,
  isFeatured, sort, page, limit`. `category` is **populated** as
  `{ _id, name, slug }`.
- `GET /categories` → `{ data: { categories } }`.

Base URL already includes `/api/v1` (`VITE_API_BASE_URL`).

---

## 3. Architecture notes

- **Server state via React Query** (rule (b)): products/categories are fetched
  with query hooks and structured keys (`productKeys`, `categoryKeys`); nothing
  catalog-related lives in Redux.
- **Each section owns its data + states**: Home just composes; every section
  renders its own loading skeletons / empty / error UI.
- **`useOptimistic` + `useTransition`** (rules (i),(j)): the wishlist heart
  flips instantly via `useWishlistToggle`. Commit is local now; Feature 9 adds
  server persistence inside the same transition — `ProductCard` won't change.
- **Hook boundary for cart**: `ProductCard` calls `useAddToCart().addToCart`.
  Today it bumps the Navbar badge + toasts; Feature 6 swaps the hook internals
  for real line items + server sync without touching the card.
- **Forms** (rule (m)): the newsletter uses RHF + Zod + the shared
  `RHFTextField`.
- **MUI v9 Grid**: uses `<Grid container>` + `<Grid size={{ xs, sm, md }}>`
  (no `item` prop).

---

## 4. How to test it

1. `npm run dev`, open `/`.
2. **Hero** animates in (staggered). "Shop now" / "Explore categories" → `/products`.
3. **Categories**: tiles load (skeletons first) from `GET /categories`; click →
   `/products?category=<slug>` (lands on the listing in Feature 5).
4. **Featured products**: grid loads from `GET /products?isFeatured=true`.
   - Hover a card → subtle lift.
   - Click the heart → fills instantly (optimistic); the Navbar wishlist badge
     increments.
   - Click add-to-cart → toast + Navbar cart badge increments.
   - Click the card → `/products/<slug>` (detail page is Feature 5).
5. **Promo banners** animate in on scroll.
6. **Newsletter**: invalid email → inline error; valid → success toast + reset.
7. Toggle light/dark — every section adapts. Resize to 375px.

---

## 5. Flags / decisions

- **Seed data needed**: Featured/categories only show if the backend has
  categories and products with `isFeatured: true` (and `isActive: true`).
  Otherwise you'll see graceful empty states. Seed via the backend if the home
  grid looks empty.
- **Newsletter has no backend endpoint** — the form validates and confirms
  locally (toast). When an endpoint is added, swap `onSubmit` for a service +
  mutation; the form is unchanged.
- **Add-to-cart is minimal** (badge + toast) until Feature 6; **wishlist is
  local** (Redux) until Feature 9. Both are behind hooks so the card is final.
- **Currency is USD** (matches the backend Stripe config) — change once in
  `formatCurrency.ts` if needed.
- **Product detail links** point at `/products/:slug`, which 404s until
  Feature 5.

## 6. External setup required
None. (Stripe/newsletter integrations are flagged with their features.)
