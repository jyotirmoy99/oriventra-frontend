# Oriventra Frontend — Docs

Per-feature documentation for the Oriventra storefront (React 19 + Vite + TS +
React Router v7 + Redux Toolkit + TanStack Query v5 + MUI + Tailwind + Framer
Motion). Features are built and documented one at a time.

## Index

| # | Feature | Doc | Status |
| - | ------- | --- | ------ |
| 1 | Theme system (MUI light/dark, shared Tailwind tokens, toggle) | [01-theme-system.md](./01-theme-system.md) | ✅ Done |
| 2 | Layout (Navbar, Footer, layouts, guards, routing, transitions) | [02-layout.md](./02-layout.md) | ✅ Done |
| 3 | Auth (register/login/forgot/reset/verify, authSlice, cookie sessions) | [03-auth.md](./03-auth.md) | ✅ Done |
| 4 | Home (hero, featured, categories, banners, newsletter) | [04-home.md](./04-home.md) | ✅ Done |
| 5 | Product (listing + filters, product detail) | [05-product.md](./05-product.md) | ✅ Done |
| 6 | Cart (dual guest/server cart, drawer + page, merge on login) | [06-cart.md](./06-cart.md) | ✅ Done |
| 7 | Checkout (multi-step, address book, Stripe hosted Checkout + COD) | [07-checkout.md](./07-checkout.md) | ✅ Done |
| 8 | Orders (history list + detail with animated status timeline) | [08-orders.md](./08-orders.md) | ✅ Done |
| 9 | User profile (info, avatar, addresses) + server-synced wishlist | [09-profile.md](./09-profile.md) | ✅ Done |
| 10 | Reviews (write: add/edit/delete with star rating) | [10-reviews.md](./10-reviews.md) | ✅ Done |
| 11 | Admin dashboard (stats, recharts chart, manage products/orders/users) | [11-admin.md](./11-admin.md) | ✅ Done |

## Conventions (enforced across all features)

- API calls → `src/services/[module].service.ts` (shared `axiosInstance`).
- Redux slices → `src/features/[module]/[module]Slice.ts` — **global UI state
  only** (auth, cart count, theme). Server state lives in TanStack Query.
- Zod schemas → `src/validations/[module].schema.ts`.
- Types → `src/types/[module].types.ts`.
- Reusable hooks → `src/hooks/use[Name].ts`.
- Route-level code splitting via `React.lazy` + `Suspense`.
- Pages wrapped in Framer Motion `AnimatePresence` transitions.
- Forms via React Hook Form + Zod resolvers.
- Responsive down to 375px (Tailwind + MUI `sx`/`useMediaQuery`).

### MUI v9 note
`Stack` takes only `direction` / `spacing` / `divider` / `useFlexGap` / `sx`.
Put `alignItems`, `justifyContent`, `flexWrap`, `width`, etc. in `sx`.
