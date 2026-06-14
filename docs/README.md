# Oriventra Frontend — Docs

Per-feature documentation for the Oriventra storefront (React 19 + Vite + TS +
React Router v7 + Redux Toolkit + TanStack Query v5 + MUI + Tailwind + Framer
Motion). Features are built and documented one at a time.

## Index

| # | Feature | Doc | Status |
| - | ------- | --- | ------ |
| 1 | Theme system (MUI light/dark, shared Tailwind tokens, toggle) | [01-theme-system.md](./01-theme-system.md) | ✅ Done |
| 2 | Layout (Navbar, Footer, layouts, protected routes) | — | ⏳ Next |
| 3 | Auth (register/login/forgot/reset/verify, authSlice) | — | ⏳ |
| 4 | Home (hero, featured, categories, banners, newsletter) | — | ⏳ |
| 5 | Product (listing + filters, product detail) | — | ⏳ |
| 6 | Cart | — | ⏳ |
| 7 | Checkout (multi-step + Stripe) | — | ⏳ |
| 8 | Orders | — | ⏳ |
| 9 | User profile (info, avatar, addresses, wishlist) | — | ⏳ |
| 10 | Reviews | — | ⏳ |
| 11 | Admin dashboard | — | ⏳ |

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
