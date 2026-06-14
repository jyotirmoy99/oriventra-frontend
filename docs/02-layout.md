# Feature 2 — Layout & Routing

The app shell: responsive **Navbar**, **Footer**, three **layouts**
(`RootLayout`, `AuthLayout`, `AdminLayout`), **route guards**
(`PrivateRoute`, `AdminRoute`), route-level **code splitting**, **page
transitions**, and **error boundaries**. Also lays the minimal Redux foundation
(`auth`, `cart`, `wishlist`) the chrome depends on.

---

## 1. File map

### State foundation
| File | Responsibility |
| --- | --- |
| `src/types/auth.types.ts` | `AuthState` + `AuthCredentials` types. |
| `src/features/auth/authSlice.ts` | Global auth state (user, token, isAuthenticated, isLoading) + selectors. **Minimal — Feature 3 adds the API/bootstrap.** |
| `src/features/cart/cartSlice.ts` | `totalQuantity` for the Navbar cart badge. **Minimal — Feature 6 builds the full cart.** |
| `src/features/wishlist/wishlistSlice.ts` | Wishlist IDs for the badge + membership checks. **Minimal — Feature 9 expands.** |
| `src/store/index.ts` | Registers the three reducers. |

### Routing
| File | Responsibility |
| --- | --- |
| `src/routes/paths.ts` | Central URL constants + `productsSearchPath()`. |
| `src/routes/PrivateRoute.tsx` | Guard: requires any signed-in user; remembers intended URL. |
| `src/routes/AdminRoute.tsx` | Guard: requires `role === "admin"`. |
| `src/app/lazyPages.ts` | `React.lazy` page chunks (rule (f)). |
| `src/app/router.tsx` | Route tree: RootLayout / AuthLayout / AdminLayout groups + `errorElement`. |

### Shared UI
| File | Responsibility |
| --- | --- |
| `src/components/common/AnimatedOutlet.tsx` | `<Outlet>` + Framer Motion page transition + Suspense (rules (l),(f)). |
| `src/components/common/ErrorBoundary.tsx` | Class error boundary wrapping each layout's content (rule (n)). |
| `src/components/common/RouteError.tsx` | Router `errorElement` (404 / loader errors). |
| `src/components/common/FullScreenLoader.tsx` | Centered spinner (Suspense + guard loading). |

### Layout components
| File | Responsibility |
| --- | --- |
| `src/components/layout/Navbar.tsx` | Sticky frosted app bar; responsive at `md`. |
| `src/components/layout/SearchBar.tsx` | Rounded search field → `/products?search=`. |
| `src/components/layout/UserMenu.tsx` | Avatar dropdown (signed in) / Login+Sign-up (signed out). |
| `src/components/layout/MobileDrawer.tsx` | Right drawer for `< md`. |
| `src/components/layout/navConfig.ts` | Shared primary nav items. |
| `src/components/layout/Footer.tsx` | Multi-column footer + socials + legal bar. |
| `src/components/layout/RootLayout.tsx` | Storefront shell (Navbar + content + Footer). |
| `src/components/layout/AuthLayout.tsx` | Centered card shell for auth pages. |
| `src/components/layout/AdminLayout.tsx` | Sidebar + topbar dashboard shell. |

### Hooks & placeholder pages
| File | Responsibility |
| --- | --- |
| `src/hooks/useDebounce.ts` | Generic debounce (rule (k)) — used by search now, product search later. |
| `src/pages/PlaceholderPage.tsx` | Reusable "coming soon" page. |
| `src/pages/auth/LoginPage.tsx`, `src/pages/ProfilePage.tsx`, `src/pages/admin/DashboardPage.tsx` | Placeholders so layouts/guards are testable now (replaced in F3/F9/F11). |
| `src/pages/NotFoundPage.tsx` | Branded 404 (rendered inside RootLayout). |

---

## 2. Route tree

```
/                         RootLayout            (Navbar + Footer)
 ├── index                HomePage
 ├── (PrivateRoute)
 │     └── profile        ProfilePage           → redirects to /login if signed out
 └── *                    NotFoundPage          (keeps chrome)

(AuthLayout)              centered card, no chrome
 └── login                LoginPage

(AdminRoute → AdminLayout) sidebar dashboard
 └── admin                DashboardPage         → redirects to /login (or / if non-admin)
```

`AuthLayout` and `AdminRoute` are **pathless layout routes** — they wrap
children without adding a URL segment, so `login` resolves to `/login` and
`admin` to `/admin`.

---

## 3. Key mechanisms

### Page transitions (rule (l))
`AnimatedOutlet` wraps `<Outlet>` in `<AnimatePresence mode="wait">` keyed on
`location.pathname`. The old page fades/slides out before the new one enters.
Every layout uses it, so transitions are consistent without each page opting in.

### Code splitting (rule (f))
Pages are `React.lazy()` chunks in `lazyPages.ts`; the build emits one JS file
per page. They stream in behind `AnimatedOutlet`'s `<Suspense>` fallback
(`FullScreenLoader`).

### Error handling (rule (n))
- **Render errors** → `ErrorBoundary` around each layout's content shows a
  recoverable "Try again" card.
- **Router errors** (bad loader, thrown 404) → `RouteError` via `errorElement`.

### Guards
`PrivateRoute`/`AdminRoute` read `auth` from Redux. While `isLoading` (session
verification on boot — Feature 3) they show a loader; otherwise they redirect.
`PrivateRoute` stashes the attempted location in `state.from` so login can bounce
the user back.

### Responsiveness (rule (o))
`useMediaQuery(theme.breakpoints.up("md"))` switches the Navbar between the full
desktop bar and the hamburger+drawer layout. AdminLayout uses a permanent drawer
on `md+` and a temporary overlay below. Everything works down to 375px.

---

## 4. Redux foundation (intentionally minimal)

These slices exist now only to feed the chrome and guards; they are **expanded
in their own features**:

- `authSlice` → real API/thunks + on-load session restore in **Feature 3**.
  `isLoading` starts `false` here (no bootstrap yet); Feature 3 flips it `true`
  during the session check.
- `cartSlice` → full cart (items, subtotal, optimistic updates) in **Feature 6**.
- `wishlistSlice` → full wishlist with `useOptimistic` in **Feature 9**.

---

## 5. How to test it

1. `npm run dev`.
2. **Navbar**: logo gradient, Home/Shop links (active state), centered search,
   wishlist + cart badges (currently 0), theme toggle, "Login / Sign up".
3. **Search**: type a term, press Enter → navigates to `/products?search=…`
   (lands on the 404 for now; the listing page is Feature 5).
4. **Responsive**: narrow the window below ~900px → links/search collapse into
   the hamburger drawer (right side). Test down to 375px.
5. **Footer**: columns collapse to one column under `sm`.
6. **Guards**: visit `/profile` or `/admin` → redirected to `/login` (you're not
   signed in yet). This proves the guards work; the protected pages/admin shell
   become visible after you can log in (Feature 3 — sign in as an admin to see
   `AdminLayout`).
7. **AuthLayout**: visit `/login` → centered branded card, no Navbar/Footer.
8. **404**: visit any unknown URL → branded 404 with chrome intact.
9. **Transitions**: navigate between pages → subtle fade/slide.
10. **Theme**: toggle persists across all of the above.

---

## 6. Notes / decisions

- **Minimal slices now vs. later**: the guards and badges need `auth`/`cart`/
  `wishlist` to exist, so they're scaffolded here with forward-compatible
  reducer names and expanded in their own features. No rework expected.
- **Placeholders**: `LoginPage`, `ProfilePage`, `DashboardPage` use the same
  filenames their real versions will, so wiring them now causes no churn later.
- **Vendor bundle**: pages are split, but the shared framework (React + MUI +
  Router + Query + Framer + Redux) is ~727 kB in one chunk. Optional later
  optimization: a `manualChunks`/`codeSplitting` vendor split for better
  long-term caching. Not required for functionality.

## 7. External setup required
None for this feature.
