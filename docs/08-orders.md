# Feature 8 — Orders

Order **history** (`/orders`) and **detail** (`/orders/:id`) with a Framer Motion
status timeline, cancel, and "complete payment" for unpaid Stripe orders. Reuses
the order foundation (types/service/hooks) from Feature 7.

---

## 1. File map

| File | Responsibility |
| --- | --- |
| `src/hooks/useOrders.ts` | `useMyOrders`, `useOrder`, **`useCancelOrder`** (+ `orderKeys`). |
| `src/components/order/orderStatusConfig.ts` | Status flow, labels, colors (shared). |
| `src/components/order/OrderStatusChip.tsx` | `OrderStatusChip` + `PaymentStatusChip`. |
| `src/components/order/OrderItems.tsx` | Line-item list (shared with confirmation). |
| `src/components/order/OrderTotals.tsx` | Totals breakdown (shared). |
| `src/components/order/OrderStatusTimeline.tsx` | **Framer Motion** fulfilment timeline. |
| `src/components/order/OrderCard.tsx` | History list row. |
| `src/pages/orders/OrderListPage.tsx` | History list + status filter + pagination. |
| `src/pages/orders/OrderDetailPage.tsx` | Full order + timeline + actions. |

Routes (behind **PrivateRoute**): `/orders`, `/orders/:id`. The Navbar account
menu already links to "My Orders". `OrderSuccessPage` was refactored to reuse
`OrderItems`/`OrderTotals`.

---

## 2. Mechanics

- **Status timeline** (`OrderStatusTimeline`): walks the linear flow
  `pending → processing → shipped → delivered`. Reached steps fill in with a
  staggered Framer Motion reveal (dots spring in, connectors grow, content
  slides). Cancelled orders render a distinct two-node red branch
  (placed → cancelled, with the reason). Timestamps come from
  `statusHistory` (falling back to `createdAt` for "pending").
- **Cancel** (`useCancelOrder`): available while `pending`/`processing` (matches
  the backend's allowed transitions). A confirmation dialog takes an optional
  reason; the backend restocks. On success the detail + list caches refresh.
- **Complete payment**: for `stripe` orders still `pending`, a banner + button
  re-creates a checkout session (`POST /payments/checkout`) and redirects to
  Stripe — the same path as checkout, so an abandoned/cancelled payment can be
  resumed.
- **History**: `useMyOrders` (paginated) with a status-filter `Tabs` row;
  skeletons while loading, empty states per filter.

---

## 3. How to test it

1. Place an order (Feature 7), then open **account menu → My Orders** (`/orders`).
2. Filter by status; paginate if you have many orders.
3. Open an order → see the **animated timeline**, items, totals, address.
4. On a `pending`/`processing` order → **Cancel order** (dialog) → status flips to
   Cancelled, stock returns, timeline shows the red branch.
5. On an unpaid Stripe order → **Complete payment** → back to Stripe Checkout.
6. To see the timeline advance (processing → shipped → delivered), update the
   order status from the **admin** side (Feature 11) or directly via the API.

---

## 4. Flags / decisions

- **Status changes are admin-driven** (`PATCH /orders/:id/status`, Feature 11) or
  via the webhook (pending → processing on payment). Customers can only cancel.
- Cancel is gated to `pending`/`processing` to match backend `VALID_TRANSITIONS`;
  the server is still the source of truth (it rejects invalid transitions).
- No external setup beyond Feature 7's Stripe config.
