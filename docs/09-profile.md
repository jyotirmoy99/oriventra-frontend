# Feature 9 — User Profile & Wishlist

Account hub (profile info, **avatar upload**, **address book**) plus a
server-synced **wishlist** with a dedicated page.

---

## 1. File map

| File | Responsibility |
| --- | --- |
| `src/services/user.service.ts` | Extended with profile, avatar, wishlist (+ existing addresses). |
| `src/types/wishlist.types.ts` | `WishlistProduct` (server) + `WishlistItem` (normalized). |
| `src/validations/profile.schema.ts` | Name/phone Zod schema. |
| `src/hooks/useProfile.ts` | `useUpdateProfile`, `useUploadAvatar`, `useRemoveAvatar` (sync Redux user). |
| `src/hooks/useWishlist.ts` | Unified `useWishlist` / `useWishlistToggle` / `useWishlistCount`. |
| `src/features/wishlist/wishlistSlice.ts` | Guest wishlist (snapshots, persisted). |
| `src/features/wishlist/wishlistKeys.ts` · `mergeGuestWishlist.ts` | Server key + login merge. |
| `src/components/profile/AvatarUploader.tsx` | Avatar display + upload/remove. |
| `src/components/profile/ProfileInfoForm.tsx` | Name/phone form (email read-only). |
| `src/components/profile/AddressBook.tsx` | List + add/edit/delete/set-default. |
| `src/components/wishlist/WishlistItemCard.tsx` | Wishlist product card. |
| `src/pages/ProfilePage.tsx` | Tabs: Profile · Addresses. |
| `src/pages/WishlistPage.tsx` | Wishlist grid (`/wishlist`, public). |

`AddressForm` and the address hooks from Feature 7 are reused. `ProductCard` /
`ProductDetailPage` now pass the full product to `useWishlistToggle`.

---

## 2. Wishlist architecture (server-synced, like the cart)

```
                 ┌─────────── useWishlist / useWishlistToggle ───────────┐
   signed out →  │ guest wishlist (Redux snapshots → localStorage)        │
   signed in  →  │ server wishlist (GET populated; POST/DELETE by id)     │
                 └────────────────────────────────────────────────────────┘
   login/register ─► mergeGuestWishlist(): addToWishlist per item → clear → refetch
```

- **Guest** stores a product snapshot per item, so the wishlist page renders
  offline and persists across reloads.
- **Server** uses the populated `GET /users/me/wishlist` for the page and the
  id-returning toggle endpoints; toggles invalidate the query.
- **Heart toggle** uses React 19 `useOptimistic` for an instant flip.
- **Merge on login**: there's no bulk endpoint, so we fan out `addToWishlist`
  per guest item (backend `$addToSet` dedupes), then clear + refetch.

---

## 3. Profile mechanics

- **Profile info**: name + phone via RHF/Zod; email is read-only. Submits only
  when dirty; empty phone is omitted (backend min-length). On success the updated
  user is written back to the Redux auth slice, so the navbar avatar/menu update.
- **Avatar**: client-validates type (image) and size (≤ 2 MB), uploads multipart
  to `/users/me/avatar`, syncs the returned user. Remove is supported.
- **Address book**: list with default badge; add/edit in a dialog (reusing
  `AddressForm`), delete with confirmation, set-default — all via the address
  hooks (React Query invalidation keeps the list fresh, and checkout sees the
  same data).

---

## 4. How to test it

1. Sign in → account menu → **Profile**.
2. **Profile tab**: upload an avatar (try a >2 MB image → rejected), edit name/
   phone → Save → the navbar avatar/name update immediately.
3. **Addresses tab**: add, edit, set-default, delete. The same addresses appear
   in checkout.
4. **Wishlist**: as a guest, heart a few products → open **/wishlist** (account
   menu / navbar heart) → they're there and persist on reload. Sign in → the
   guest wishlist **merges** into your account; remove items from the page.

---

## 5. ⚠️ External setup

- **Avatar upload needs Cloudinary configured on the backend** (the user module
  uploads to Cloudinary). Without it, avatar upload will error (profile/addresses/
  wishlist still work).

## 6. Flags / decisions

- **Wishlist is server-synced** (guest local + merge on login), consistent with
  the cart, since the backend exposes wishlist endpoints.
- `/wishlist` is **public** so guests can view their local wishlist; profile is
  auth-gated.
- Wishlist cards link to the product detail page (the populated subset lacks
  variants/stock for a direct add-to-cart).
