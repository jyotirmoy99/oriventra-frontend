import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { emitUnauthorized } from "./authEvents";

// ---------------------------------------------------------------------------
// axiosInstance  (cookie-based auth)
// ---------------------------------------------------------------------------
// The backend authenticates via httpOnly cookies (accessToken 15m / refreshToken
// 7d). JavaScript cannot read them, so we DON'T attach Authorization headers or
// touch localStorage — `withCredentials: true` makes the browser send the
// cookies automatically.
//
// On a 401 we transparently try ONE refresh (POST /auth/refresh rotates the
// cookies) and replay the original request. If refresh fails we emit an
// "unauthorized" signal so the app clears its auth state; route guards handle
// any redirect (we deliberately don't hard-redirect here, so logged-out users
// can still browse public pages).
// ---------------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Auth endpoints must never trigger a refresh-retry (a 401 from /auth/login is
// "wrong password", not "expired session"; refreshing /auth/refresh would loop).
const AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
];

const isAuthPath = (url?: string): boolean =>
  !!url && AUTH_PATHS.some((path) => url.startsWith(path));

// A single in-flight refresh shared by all concurrent 401s (prevents a refresh
// stampede when several requests fail at once).
let refreshPromise: Promise<void> | null = null;

const refreshSession = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Mark requests we've already retried so we attempt refresh at most once each.
interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthPath(original.url)
    ) {
      original._retry = true;
      try {
        await refreshSession(); // rotate cookies
        return await axiosInstance(original); // replay original request
      } catch {
        emitUnauthorized(); // refresh failed → clear auth state
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
