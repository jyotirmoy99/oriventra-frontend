import type { Order, OrderStatus, PaymentStatus } from "./order.types";
import type { Pagination, Product } from "./product.types";
import type { User, UserRole } from "./index";

// ---------------------------------------------------------------------------
// Admin types (mirror the backend admin module)
// ---------------------------------------------------------------------------

// --- Dashboard stats -------------------------------------------------------

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  user?: { _id: string; name: string; email: string } | null;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<OrderStatus, number>;
  recentOrders: RecentOrder[];
}

// --- Users -----------------------------------------------------------------

export interface AdminUserQuery {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface AdminUserListResult {
  users: User[];
  pagination: Pagination;
}

// --- Orders (user populated) ----------------------------------------------

export interface AdminOrderUser {
  _id: string;
  name: string;
  email: string;
}

export type AdminOrder = Omit<Order, "user"> & { user: AdminOrderUser | null };

export interface AdminOrderQuery {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string; // orderNumber
  page?: number;
  limit?: number;
}

export interface AdminOrderListResult {
  orders: AdminOrder[];
  pagination: Pagination;
}

// --- Products (incl. inactive) --------------------------------------------

export interface AdminProductQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminProductListResult {
  products: Product[];
  pagination: Pagination;
}
