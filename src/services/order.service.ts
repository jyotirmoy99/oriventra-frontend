import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";
import type {
  Order,
  OrderListParams,
  OrderListResult,
  PlaceOrderPayload,
} from "../types/order.types";

// ---------------------------------------------------------------------------
// order.service
// ---------------------------------------------------------------------------
// Customer order endpoints (all auth-only). placeOrder builds the order from the
// server cart and empties it.
// ---------------------------------------------------------------------------

/** POST /orders — place an order from the current cart. */
export async function placeOrder(payload: PlaceOrderPayload): Promise<Order> {
  const { data } = await axiosInstance.post<ApiResponse<{ order: Order }>>(
    "/orders",
    payload,
  );
  return data.data!.order;
}

/** GET /orders — the current user's order history. */
export async function listMyOrders(
  params: OrderListParams = {},
): Promise<OrderListResult> {
  const { data } = await axiosInstance.get<ApiResponse<OrderListResult>>(
    "/orders",
    { params },
  );
  return data.data!;
}

/** GET /orders/:id — a single order. */
export async function getOrder(id: string): Promise<Order> {
  const { data } = await axiosInstance.get<ApiResponse<{ order: Order }>>(
    `/orders/${id}`,
  );
  return data.data!.order;
}

/** PATCH /orders/:id/cancel — cancel an order (restocks server-side). */
export async function cancelOrder(id: string, reason?: string): Promise<Order> {
  const { data } = await axiosInstance.patch<ApiResponse<{ order: Order }>>(
    `/orders/${id}/cancel`,
    { reason },
  );
  return data.data!.order;
}
