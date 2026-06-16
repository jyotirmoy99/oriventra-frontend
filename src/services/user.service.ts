import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse, Address } from "../types";

// ---------------------------------------------------------------------------
// user.service — address book
// ---------------------------------------------------------------------------
// Address CRUD under /users/me/addresses (needed by checkout now; the profile
// feature reuses these). Profile/avatar/wishlist functions arrive in Feature 9.
// ---------------------------------------------------------------------------

export interface AddressInput {
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

/** GET /users/me/addresses */
export async function listAddresses(): Promise<Address[]> {
  const { data } = await axiosInstance.get<
    ApiResponse<{ addresses: Address[] }>
  >("/users/me/addresses");
  return data.data!.addresses;
}

/** POST /users/me/addresses */
export async function addAddress(payload: AddressInput): Promise<Address> {
  const { data } = await axiosInstance.post<ApiResponse<{ address: Address }>>(
    "/users/me/addresses",
    payload,
  );
  return data.data!.address;
}

/** PATCH /users/me/addresses/:id */
export async function updateAddress(
  addressId: string,
  payload: Partial<AddressInput>,
): Promise<Address> {
  const { data } = await axiosInstance.patch<ApiResponse<{ address: Address }>>(
    `/users/me/addresses/${addressId}`,
    payload,
  );
  return data.data!.address;
}

/** DELETE /users/me/addresses/:id */
export async function deleteAddress(addressId: string): Promise<void> {
  await axiosInstance.delete(`/users/me/addresses/${addressId}`);
}

/** PATCH /users/me/addresses/:id/default */
export async function setDefaultAddress(addressId: string): Promise<void> {
  await axiosInstance.patch(`/users/me/addresses/${addressId}/default`);
}
