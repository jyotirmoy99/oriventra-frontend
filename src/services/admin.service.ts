import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse, User, UserRole } from "../types";
import type { Order, OrderStatus } from "../types/order.types";
import type {
  AdminOrderListResult,
  AdminOrderQuery,
  AdminProductListResult,
  AdminProductQuery,
  AdminUserListResult,
  AdminUserQuery,
  DashboardStats,
} from "../types/admin.types";

// ---------------------------------------------------------------------------
// admin.service — dashboard, users, orders, products (all admin-only)
// ---------------------------------------------------------------------------

/** GET /admin/stats */
export async function getStats(): Promise<DashboardStats> {
  const { data } = await axiosInstance.get<ApiResponse<{ stats: DashboardStats }>>(
    "/admin/stats",
  );
  return data.data!.stats;
}

// --- Users -----------------------------------------------------------------

export async function listUsers(
  params: AdminUserQuery = {},
): Promise<AdminUserListResult> {
  const { data } = await axiosInstance.get<ApiResponse<AdminUserListResult>>(
    "/admin/users",
    { params },
  );
  return data.data!;
}

export async function updateUserRole(id: string, role: UserRole): Promise<User> {
  const { data } = await axiosInstance.patch<ApiResponse<{ user: User }>>(
    `/admin/users/${id}/role`,
    { role },
  );
  return data.data!.user;
}

export async function deleteUser(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/users/${id}`);
}

// --- Orders ----------------------------------------------------------------

export async function listOrders(
  params: AdminOrderQuery = {},
): Promise<AdminOrderListResult> {
  const { data } = await axiosInstance.get<ApiResponse<AdminOrderListResult>>(
    "/admin/orders",
    { params },
  );
  return data.data!;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
): Promise<Order> {
  const { data } = await axiosInstance.patch<ApiResponse<{ order: Order }>>(
    `/admin/orders/${id}/status`,
    { status, note },
  );
  return data.data!.order;
}

// --- Products --------------------------------------------------------------

export async function listProducts(
  params: AdminProductQuery = {},
): Promise<AdminProductListResult> {
  const { data } = await axiosInstance.get<ApiResponse<AdminProductListResult>>(
    "/admin/products",
    { params },
  );
  return data.data!;
}
