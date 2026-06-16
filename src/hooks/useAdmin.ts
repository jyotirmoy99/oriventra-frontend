import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as adminService from "../services/admin.service";
import * as productService from "../services/product.service";
import { productKeys } from "./useProducts";
import { orderKeys } from "./useOrders";
import type { UserRole } from "../types";
import type { OrderStatus } from "../types/order.types";
import type { ProductInput } from "../types/product.types";
import type {
  AdminOrderQuery,
  AdminProductQuery,
  AdminUserQuery,
} from "../types/admin.types";

// ---------------------------------------------------------------------------
// Admin hooks (server state + mutations)
// ---------------------------------------------------------------------------

export const adminKeys = {
  all: ["admin"] as const,
  stats: ["admin", "stats"] as const,
  users: (params: AdminUserQuery) => ["admin", "users", params] as const,
  orders: (params: AdminOrderQuery) => ["admin", "orders", params] as const,
  products: (params: AdminProductQuery) => ["admin", "products", params] as const,
};

// --- Dashboard -------------------------------------------------------------

export function useAdminStats() {
  return useQuery({ queryKey: adminKeys.stats, queryFn: adminService.getStats });
}

// --- Users -----------------------------------------------------------------

export function useAdminUsers(params: AdminUserQuery = {}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.listUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      adminService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
    },
  });
}

// --- Orders ----------------------------------------------------------------

export function useAdminOrders(params: AdminOrderQuery = {}) {
  return useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: () => adminService.listOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: OrderStatus; note?: string }) =>
      adminService.updateOrderStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      queryClient.invalidateQueries({ queryKey: orderKeys.all }); // customer views
    },
  });
}

// --- Products --------------------------------------------------------------

export function useAdminProducts(params: AdminProductQuery = {}) {
  return useQuery({
    queryKey: adminKeys.products(params),
    queryFn: () => adminService.listProducts(params),
    placeholderData: keepPreviousData,
  });
}

// Product writes invalidate both the admin list and the public product queries.
function useProductInvalidation() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    queryClient.invalidateQueries({ queryKey: productKeys.all });
  };
}

export function useCreateProduct() {
  const invalidate = useProductInvalidation();
  return useMutation({
    mutationFn: (payload: ProductInput) => productService.createProduct(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateProduct() {
  const invalidate = useProductInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProductInput> }) =>
      productService.updateProduct(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useProductInvalidation();
  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: invalidate,
  });
}

export function useUploadProductImages() {
  const invalidate = useProductInvalidation();
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      productService.uploadProductImages(id, files),
    onSuccess: invalidate,
  });
}

export function useRemoveProductImage() {
  const invalidate = useProductInvalidation();
  return useMutation({
    mutationFn: ({ id, publicId }: { id: string; publicId: string }) =>
      productService.removeProductImage(id, publicId),
    onSuccess: invalidate,
  });
}
