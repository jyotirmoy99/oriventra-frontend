// ---------------------------------------------------------------------------
// Shared base types (mirror the backend contracts)
// ---------------------------------------------------------------------------

/** All roles the backend recognizes (constants/roles.ts). */
export type UserRole = "user" | "admin" | "superadmin" | "moderator";

/** Avatar image stored on Cloudinary (publicId kept for delete/replace). */
export interface Avatar {
  url: string;
  publicId: string;
}

/** A delivery address (embedded subdocument with its own _id). */
export interface Address {
  _id: string;
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

/**
 * Authenticated user — matches the backend User model's JSON output (sensitive
 * fields are stripped server-side).
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatar?: Avatar;
  addresses: Address[];
  wishlist: string[]; // product IDs
  createdAt: string;
  updatedAt: string;
}

/** Standard success/response envelope from the API. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

/** Generic paginated payload (list endpoints). */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** A single field error from the backend's Zod validation handler. */
export interface ApiFieldError {
  field: string;
  message: string;
}

/** Shape of an error response body (`message` always; `errors` for validation). */
export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: ApiFieldError[];
}

/** Roles that may access the admin area (matches backend authorize() usage). */
export const ADMIN_ROLES: UserRole[] = ["admin", "superadmin"];

/** True if the user can access admin-only features. */
export const isAdminRole = (role: UserRole | undefined): boolean =>
  role !== undefined && ADMIN_ROLES.includes(role);
