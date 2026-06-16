import { lazy } from "react";

// ---------------------------------------------------------------------------
// Lazy-loaded pages
// ---------------------------------------------------------------------------
// Centralizes route-level code splitting (rule (f)). Each page becomes its own
// chunk, loaded on demand behind the Suspense boundary in AnimatedOutlet. Kept
// separate from router.tsx so that file mixes no component definitions with its
// non-component `router` export (keeps the react-refresh rule satisfied).
// ---------------------------------------------------------------------------

export const HomePage = lazy(() => import("../pages/HomePage"));
export const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
export const ProfilePage = lazy(() => import("../pages/ProfilePage"));
export const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));

// Product
export const ProductListPage = lazy(() => import("../pages/products/ProductListPage"));
export const ProductDetailPage = lazy(() => import("../pages/products/ProductDetailPage"));

// Cart
export const CartPage = lazy(() => import("../pages/CartPage"));

// Auth pages
export const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
export const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
export const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage"),
);
export const ResetPasswordPage = lazy(
  () => import("../pages/auth/ResetPasswordPage"),
);
export const VerifyEmailPage = lazy(
  () => import("../pages/auth/VerifyEmailPage"),
);
