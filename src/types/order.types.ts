import type { Pagination } from "./product.types";

// ---------------------------------------------------------------------------
// Order types (mirror the backend order module)
// ---------------------------------------------------------------------------
// Orders snapshot everything at purchase time (item name/price, address), so
// they're immutable even if the product/address later changes.
// ---------------------------------------------------------------------------

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "cod" | "stripe";

export interface OrderItem {
  product: string; // product id (ref)
  name: string;
  image?: string;
  variantId?: string;
  variant?: { size?: string; color?: string };
  sku?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  note?: string;
  at: string;
}

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;

  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;

  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;

  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;

  createdAt: string;
  updatedAt: string;
}

/** POST /orders body. */
export interface PlaceOrderPayload {
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  note?: string;
}

/** Query for GET /orders (history). */
export interface OrderListParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

/** `data` shape from GET /orders. */
export interface OrderListResult {
  orders: Order[];
  pagination: Pagination;
}
