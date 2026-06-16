# Feature 7 — Checkout

Multi-step checkout (address → payment), order placement, **Stripe hosted
Checkout** (or Cash on Delivery), and the order confirmation / cancel pages.

---

## 1. File map

| File | Responsibility |
| --- | --- |
| `src/types/order.types.ts` | `Order`, `OrderItem`, `ShippingAddress`, statuses, payloads. |
| `src/services/order.service.ts` | `placeOrder`, `listMyOrders`, `getOrder`, `cancelOrder`. |
| `src/services/payment.service.ts` | `createCheckout(orderId)` → `{ url, sessionId }`. |
| `src/services/user.service.ts` | Address book CRUD (`/users/me/addresses`). |
| `src/validations/address.schema.ts` | Address Zod schema (matches backend). |
| `src/lib/stripe.ts` | `getStripe()` (loads pk) + `redirectToCheckout`. |
| `src/hooks/useAddresses.ts` | Address query + mutations. |
| `src/hooks/useOrders.ts` | `useMyOrders`, `useOrder` (+ `orderKeys`). |
| `src/hooks/useCheckout.ts` | Orchestrates place-order → pay/redirect. |
| `src/components/checkout/AddressForm.tsx` | RHF+Zod address form (reused in F9). |
| `src/components/checkout/AddressStep.tsx` | Pick/add a shipping address. |
| `src/components/checkout/PaymentStep.tsx` | Method (Stripe/COD) + coupon + note. |
| `src/components/checkout/OrderSummaryCard.tsx` | Cart lines + estimated totals. |
| `src/pages/checkout/CheckoutPage.tsx` | The 2-step flow. |
| `src/pages/orders/OrderSuccessPage.tsx` | Confirmation (`/order/success`). |
| `src/pages/orders/OrderCancelPage.tsx` | Payment cancelled (`/order/cancel`). |

Routes (all behind **PrivateRoute** — orders/cart are auth-only): `/checkout`,
`/order/success`, `/order/cancel`.

---

## 2. The flow

```
/checkout (2 steps)
  1. Address  → pick a saved address or add one (auto-selects default)
  2. Payment  → Stripe card  | Cash on Delivery   (+ optional coupon / note)
        │
        ▼  Place order
  POST /orders {shippingAddressId, paymentMethod, couponCode?, note?}
        │  (server computes totals, deducts stock, EMPTIES the cart)
        ├── stripe → POST /payments/checkout {orderId} → { url } → redirect to Stripe
        │              success_url → /order/success?orderId=…
        │              cancel_url  → /order/cancel?orderId=…
        └── cod    → navigate /order/success?orderId=…
```

- **Totals are authoritative from the server** (`placeOrder` computes subtotal,
  shipping, tax, coupon discount). The checkout summary shows an **estimate**
  (shipping mirrors the backend rule: free ≥ $100, else $10); the confirmation
  shows exact figures.
- **Stripe is hosted Checkout**: the backend returns a `url`; the frontend
  redirects there. `lib/stripe.ts` initialises Stripe.js with the publishable
  key first, then redirects to the url (the recommended pattern for
  server-created sessions). Card details never touch our app.
- **Payment confirmation is asynchronous** (Stripe webhook → backend marks the
  order paid). Right after returning, the order may read "Payment pending"; the
  success page says so.

---

## 3. ⚠️ Backend / external setup required

For the **Stripe** path to fully work end-to-end you need (backend `.env`):

1. **`STRIPE_SECRET_KEY`** — the secret key for the **same** Stripe account as the
   publishable key (`pk_test_51LaFY7…`). Publishable + secret must match.
2. **`STRIPE_WEBHOOK_SECRET`** + a running webhook, so paid orders flip to
   `paid`. In local dev:
   ```bash
   stripe listen --forward-to localhost:8000/api/v1/payments/webhook
   ```
   and put the printed `whsec_…` in `STRIPE_WEBHOOK_SECRET`. **Without the
   webhook, Stripe-paid orders stay "pending"** (the order is still created).
3. **`CLIENT_URL=http://localhost:5173`** so Stripe's success/cancel redirects
   land on the frontend.

**Test card:** `4242 4242 4242 4242`, any future expiry, any CVC/ZIP.

> Tip: **Cash on Delivery works with no Stripe setup at all** — use it to test
> the full order flow (placement → confirmation → history) without the webhook.

The frontend `VITE_STRIPE_PUBLISHABLE_KEY` is already set to the provided key.

---

## 4. How to test it

1. Sign in (checkout requires auth; a guest clicking checkout is sent to login and
   their cart merges on return). Add items.
2. `/cart` → **Proceed to checkout**.
3. **Step 1**: select a saved address, or **Add a new address** (validated form);
   the default is auto-selected.
4. **Step 2**: choose **Cash on Delivery** → **Place order** → lands on
   `/order/success` with the order summary (status pending).
5. Choose **Card (Stripe)** → **Pay with card** → Stripe's hosted page → pay with
   `4242…` → returns to `/order/success`. With the webhook running it shows
   **Paid**; otherwise **Payment pending** until the webhook fires.
6. On Stripe, click **back/cancel** → `/order/cancel`.

---

## 5. Flags / decisions

- **Hosted Checkout** (not Elements) because that's what the backend implements;
  the frontend redirects to the returned url. `@stripe/stripe-js` + the
  publishable key are wired (`getStripe`) and ready for Elements if ever needed.
- **COD + Stripe** both supported (backend `PAYMENT_METHODS`).
- **Coupon** is optional and validated server-side at order time (invalid codes
  surface as an error); there's no separate preview endpoint.
- Checkout/confirmation are **auth-gated**.
- "View order" links to `/orders/:id` (the order detail page is **Feature 8**).
