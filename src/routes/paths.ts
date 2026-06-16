// ---------------------------------------------------------------------------
// Route paths
// ---------------------------------------------------------------------------
// Single source of truth for URLs so links, guards, and the router never drift
// from each other. Functions build parameterized paths.
// ---------------------------------------------------------------------------

export const PATHS = {
  home: "/",
  products: "/products",
  productDetail: (id: string) => `/products/${id}`,
  cart: "/cart",
  wishlist: "/wishlist",
  checkout: "/checkout",
  orderSuccess: "/order/success", // Stripe success_url + COD confirmation
  orderCancel: "/order/cancel", // Stripe cancel_url
  orders: "/orders",
  orderDetail: (id: string) => `/orders/${id}`,
  profile: "/profile",

  // Auth
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",

  // Admin
  admin: "/admin",
  adminProducts: "/admin/products",
  adminOrders: "/admin/orders",
  adminUsers: "/admin/users",
} as const;

/** Build `/products?search=<term>` for the Navbar search. */
export function productsSearchPath(term: string): string {
  const q = term.trim();
  return q ? `${PATHS.products}?search=${encodeURIComponent(q)}` : PATHS.products;
}
