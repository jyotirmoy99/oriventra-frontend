// Query keys for the server cart — kept in their own module so both the cart
// hooks and the login-merge helper can reference them without import cycles.
export const cartKeys = {
  cart: ["cart"] as const,
};
