# Feature 6 — Cart

A real, server-synced cart that also works for signed-out shoppers. The backend
cart is **auth-only** with a `/merge` endpoint, so the design is a **dual cart**:
guests use a local (localStorage) cart that **merges into the server cart on
login**. Components use one unified `useCart` API and never branch on auth.

---

## 1. File map

| File | Responsibility |
| --- | --- |
| `src/types/cart.types.ts` | `CartLine`, `CartView`, `GuestCartItem`, payloads. |
| `src/services/cart.service.ts` | `get/add/update/remove/clear/merge` (all return `CartView`). |
| `src/features/cart/cartSlice.ts` | **Guest** cart (Redux, persisted to localStorage). |
| `src/features/cart/cartKeys.ts` | React Query key for the server cart. |
| `src/features/cart/mergeGuestCart.ts` | Folds the guest cart into the server cart on login. |
| `src/store/index.ts` | Subscribes to persist the guest cart to localStorage. |
| `src/hooks/useCart.ts` | **Unified** `useCart()` + lightweight `useCartCount()`. |
| `src/store/useCartDrawer.ts` | Zustand store for the mini-cart open state. |
| `src/components/cart/CartItemRow.tsx` | Line row (optimistic quantity). |
| `src/components/cart/CartDrawer.tsx` | Mini-cart slide-over (mounted in RootLayout). |
| `src/components/cart/EmptyCart.tsx` | Shared empty state. |
| `src/pages/CartPage.tsx` | Full cart page (`/cart`). |

Wired into `lazyPages.ts`/`router.tsx` (public `/cart`), the Navbar (icon opens
the drawer; badge = `useCartCount`), and `RootLayout` (mounts `CartDrawer`).
`ProductCard`/`ProductDetailPage` now use the real `addToCart`.

---

## 2. Dual-cart architecture

```
                ┌─────────────── useCart() ───────────────┐
   signed out → │ guest cart (Redux + localStorage)        │
   signed in  → │ server cart (React Query: GET/POST /cart)│
                └──────────────────────────────────────────┘
                         one API: items, subtotal, totalItems,
                         addToCart / updateQuantity / removeItem / clear

   login/register ─► mergeGuestCart(): POST /cart/merge → clear guest → refetch
```

- **Guest cart** stores a small product **snapshot** (name, image, price,
  variant, stock) per line so it renders and totals locally, and persists across
  reloads. `store/index.ts` saves it to `localStorage` on change.
- **Server cart** is fetched/mutated via React Query; each mutation re-primes the
  cache from the backend's recomputed `CartView` (live prices + availability).
- **Merge on login** (`mergeGuestCart`) is called from `useLogin`/`useRegister`
  `onSuccess`: sends the guest lines to `/cart/merge`, clears the guest cart, and
  invalidates the server cart. Failures are swallowed so a stale guest cart can
  never block sign-in.

---

## 3. Notable mechanics

- **Optimistic quantity** (rule (i)): `CartItemRow` uses React 19 `useOptimistic`
  + `useTransition`, so +/- updates the displayed quantity and line total
  instantly; the real value (server refetch / Redux) reconciles it.
- **Variant products from a card**: `ProductCard`'s add-to-cart routes to the
  detail page when the product has variants (the backend requires a `variantId`);
  simple products add directly.
- **Availability**: the backend marks lines `available: false` when stock is
  insufficient or the product was removed; the cart shows a warning and the page
  blocks checkout until they're fixed.
- **Badge**: `useCartCount` shares the server cart's query key with `useCart`
  (deduped), returning the guest count when signed out.
- **Drawer state** is ephemeral cross-component UI → Zustand (`useCartDrawer`),
  keeping it out of Redux.

---

## 4. How to test it

1. `npm run dev`. **As a guest**, add simple products from a card and variant
   products from the detail page → toast + the Navbar badge increments; the cart
   icon opens the **drawer**.
2. Change quantity (instant), remove items, open `/cart` (full page), reload →
   the guest cart **persists**.
3. **Log in** → the guest cart **merges** into your server cart (quantities
   summed, clamped to stock); reload while signed in → cart loads from the server.
4. Add/update/remove while signed in → persists server-side (check via another
   device/session).
5. **Log out** → server cart cache clears; the badge reflects the (now empty/old)
   guest cart.
6. Mobile: drawer is full-width; cart page stacks.

---

## 5. Flags / decisions

- **Dual cart** was chosen to match the backend (auth-only cart + `/merge`).
  Guests get a full cart locally; it merges on login.
- **Checkout button** navigates to `/checkout`, which **404s until Feature 7**.
- **Variant add-to-cart from cards** intentionally redirects to the detail page
  (backend needs a variant).
- **Stock conflicts** block checkout on the cart page (warning shown); the server
  is the source of truth and re-validates on every mutation.
- No external setup.
