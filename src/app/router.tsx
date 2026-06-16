import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import AuthLayout from "../components/layout/AuthLayout";
import AdminLayout from "../components/layout/AdminLayout";
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";
import RouteError from "../components/common/RouteError";
import {
  HomePage,
  NotFoundPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  ProfilePage,
  DashboardPage,
  ProductListPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrderSuccessPage,
  OrderCancelPage,
  OrderListPage,
  OrderDetailPage,
} from "./lazyPages";

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
// Layout/guard components load eagerly (they're the app shell); every PAGE is
// code-split with React.lazy (rule (f)) and streams in behind the Suspense
// boundary inside each layout's AnimatedOutlet. Each layout branch has a
// RouteError errorElement (rule (n)) for loader/render failures.
//
// Route groups:
//   • RootLayout  — public storefront (+ PrivateRoute-guarded pages)
//   • AuthLayout  — login/register/etc. (Feature 3 adds the rest)
//   • AdminLayout — admin area, behind AdminRoute (Feature 11)
// ---------------------------------------------------------------------------

const router = createBrowserRouter([
  // --- Public storefront ----------------------------------------------------
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },

      // Catalog
      { path: "products", element: <ProductListPage /> },
      { path: "products/:slug", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },

      // Signed-in-only pages (more added in later features).
      {
        element: <PrivateRoute />,
        children: [
          { path: "checkout", element: <CheckoutPage /> },
          { path: "order/success", element: <OrderSuccessPage /> },
          { path: "order/cancel", element: <OrderCancelPage /> },
          { path: "orders", element: <OrderListPage /> },
          { path: "orders/:id", element: <OrderDetailPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },

      // Storefront 404 — keeps the Navbar/Footer chrome.
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // --- Auth (focused, chrome-less shell) ------------------------------------
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "verify-email", element: <VerifyEmailPage /> },
    ],
  },

  // --- Admin (guarded dashboard shell) --------------------------------------
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        errorElement: <RouteError />,
        children: [
          { path: "admin", element: <DashboardPage /> },
          // admin/products, admin/orders, admin/users → Feature 11
        ],
      },
    ],
  },
]);

export default router;
