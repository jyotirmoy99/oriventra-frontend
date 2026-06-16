import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse, Address, User } from "../types";
import type { WishlistProduct } from "../types/wishlist.types";

// ---------------------------------------------------------------------------
// user.service — profile, avatar, address book, wishlist
// ---------------------------------------------------------------------------
// Everything under /users/me. Profile/avatar/wishlist return the full updated
// resource; the toggle wishlist endpoints return the new id array.
// ---------------------------------------------------------------------------

// --- Profile ---------------------------------------------------------------

export interface ProfileInput {
  name?: string;
  phone?: string;
}

/** GET /users/me */
export async function getProfile(): Promise<User> {
  const { data } = await axiosInstance.get<ApiResponse<{ user: User }>>(
    "/users/me",
  );
  return data.data!.user;
}

/** PATCH /users/me */
export async function updateProfile(payload: ProfileInput): Promise<User> {
  const { data } = await axiosInstance.patch<ApiResponse<{ user: User }>>(
    "/users/me",
    payload,
  );
  return data.data!.user;
}

/** POST /users/me/avatar (multipart, field name "avatar"). */
export async function uploadAvatar(file: File): Promise<User> {
  const form = new FormData();
  form.append("avatar", file);
  const { data } = await axiosInstance.post<ApiResponse<{ user: User }>>(
    "/users/me/avatar",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data!.user;
}

/** DELETE /users/me/avatar */
export async function removeAvatar(): Promise<User> {
  const { data } = await axiosInstance.delete<ApiResponse<{ user: User }>>(
    "/users/me/avatar",
  );
  return data.data!.user;
}

// --- Wishlist --------------------------------------------------------------

/** GET /users/me/wishlist — populated products. */
export async function getWishlist(): Promise<WishlistProduct[]> {
  const { data } = await axiosInstance.get<
    ApiResponse<{ wishlist: WishlistProduct[] }>
  >("/users/me/wishlist");
  return data.data!.wishlist;
}

/** POST /users/me/wishlist/:productId — returns the new id array. */
export async function addToWishlist(productId: string): Promise<string[]> {
  const { data } = await axiosInstance.post<ApiResponse<{ wishlist: string[] }>>(
    `/users/me/wishlist/${productId}`,
  );
  return data.data!.wishlist;
}

/** DELETE /users/me/wishlist/:productId — returns the new id array. */
export async function removeFromWishlist(productId: string): Promise<string[]> {
  const { data } = await axiosInstance.delete<
    ApiResponse<{ wishlist: string[] }>
  >(`/users/me/wishlist/${productId}`);
  return data.data!.wishlist;
}

// --- Address book ----------------------------------------------------------

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
