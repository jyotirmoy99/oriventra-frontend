# Feature 11 — Admin Dashboard

Admin area behind `AdminRoute` + `AdminLayout`: dashboard (KPIs + chart + recent
orders), and management of products, orders, and users.

---

## 1. File map

| File | Responsibility |
| --- | --- |
| `src/types/admin.types.ts` | `DashboardStats`, `AdminOrder`, query/result types. |
| `src/types/product.types.ts` | + `ProductInput` (create/update payload). |
| `src/services/admin.service.ts` | stats, users, orders, products (admin endpoints). |
| `src/services/product.service.ts` | + product CRUD + image upload/remove. |
| `src/hooks/useAdmin.ts` | All admin queries + mutations (`adminKeys`). |
| `src/validations/product.schema.ts` | Product form schema. |
| `src/components/admin/StatCard.tsx` | KPI card. |
| `src/components/admin/OrdersStatusChart.tsx` | **recharts** bar chart. |
| `src/components/admin/ProductFormDialog.tsx` | Create/edit product. |
| `src/components/admin/ProductImageManager.tsx` | Upload/remove images. |
| `src/pages/admin/DashboardPage.tsx` | KPIs + chart + recent orders. |
| `src/pages/admin/AdminProductsPage.tsx` | Table + CRUD + images. |
| `src/pages/admin/AdminOrdersPage.tsx` | Table + inline status update. |
| `src/pages/admin/AdminUsersPage.tsx` | Table + role toggle + delete. |

Routes (under `AdminRoute → AdminLayout`): `/admin`, `/admin/products`,
`/admin/orders`, `/admin/users`. The AdminLayout sidebar (Feature 2) links them.

---

## 2. Mechanics

- **Dashboard**: `GET /admin/stats` → KPI cards (paid revenue, orders, customers,
  products), an **orders-by-status bar chart** (recharts, theme-colored,
  dark-mode aware), and a recent-orders table. recharts is in the lazy dashboard
  chunk, so it only loads for admins.
- **Products**: searchable/paginated table (incl. inactive); create/edit via a
  dialog (RHF + Zod, category from `useCategories`); delete with confirm. **Image
  upload** (multipart, ≤6) lives in the edit dialog — create first, then add
  images (the image endpoints need a product id). Writes invalidate both the
  admin list and the public product queries.
- **Orders**: filter by status / search by number; **inline status `Select`**
  (`PATCH /admin/orders/:id/status`). The backend enforces valid transitions, so
  an invalid pick returns an error toast. Order numbers link to the shared order
  detail page (admins can view any order).
- **Users**: filter by role / search; **role `Select`** and **delete** — both
  disabled for your own account; the backend enforces its own rules (errors →
  toast).
- Numeric product fields are validated as strings and converted on submit (keeps
  RHF's input/output types aligned — `z.coerce` would diverge them).

---

## 3. ⚠️ Access & setup

- The admin area requires a user with role **`admin`** or **`superadmin`**
  (`AdminRoute`). Promote an account by setting its role in the DB/seed, or have
  an existing admin change it under **Users**. A non-admin visiting `/admin` is
  redirected home.
- **Product image upload needs Cloudinary configured on the backend** (same as
  avatars). Everything else works without it.

---

## 4. How to test it

1. Sign in as an admin → account menu → **Admin Dashboard** (or `/admin`).
2. **Dashboard**: KPIs, the orders-by-status chart, recent orders. Toggle dark
   mode — the chart adapts.
3. **Products**: create one (active/featured, price, stock, tags), then **Edit**
   it to upload images; search/filter; delete.
4. **Orders**: change an order's status inline → the customer's order timeline
   (Feature 8) advances; revenue/KPIs refresh.
5. **Users**: change a role, delete a user (not yourself). Promote a test account
   to admin to verify access.

---

## 5. Flags / decisions

- **Variants aren't edited in the admin product form** (kept focused on core
  fields + images); the backend still accepts variant products created elsewhere.
- Admin product/user mutations broadly invalidate related caches so the
  storefront reflects changes immediately.
