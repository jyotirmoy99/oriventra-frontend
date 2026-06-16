import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppSelector } from "./useAppSelector";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import * as orderService from "../services/order.service";
import type { OrderListParams } from "../types/order.types";

// ---------------------------------------------------------------------------
// Order query hooks (history list in Feature 8; detail used by confirmation)
// ---------------------------------------------------------------------------

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params: OrderListParams) => [...orderKeys.lists(), params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

/** The current user's order history (paginated/filterable). */
export function useMyOrders(params: OrderListParams = {}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderService.listMyOrders(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}

/** A single order by id. */
export function useOrder(id: string) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: isAuthenticated && Boolean(id),
  });
}

/** Cancel an order (restocks server-side); refreshes detail + lists. */
export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      orderService.cancelOrder(id, reason),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order._id), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
