// Query key for the server wishlist — separate module to avoid import cycles
// between the hooks and the login-merge helper.
export const wishlistKeys = {
  all: ["wishlist"] as const,
};
