import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "./useAppSelector";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import * as userService from "../services/user.service";
import type { AddressInput } from "../services/user.service";

// ---------------------------------------------------------------------------
// Address book hooks (server state via React Query)
// ---------------------------------------------------------------------------

export const addressKeys = {
  all: ["addresses"] as const,
};

/** The signed-in user's saved addresses. */
export function useAddresses() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: userService.listAddresses,
    enabled: isAuthenticated,
  });
}

/** Mutations all refresh the address list on success. */
export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressInput) => userService.addAddress(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AddressInput> }) =>
      userService.updateAddress(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteAddress(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.setDefaultAddress(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
}
