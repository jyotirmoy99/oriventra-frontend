# Feature 3 — Authentication

Full auth: Register, Login, Forgot/Reset password, and Email verification pages
(React Hook Form + Zod), the `authSlice`, all auth API services, and **persistent
sessions restored on app load**.

> ⚠️ **Backend reality check (important).** The Oriventra backend issues JWTs as
> **httpOnly cookies**, not in the response body. JavaScript cannot read them.
> This changed the frontend design vs. the original brief (which assumed a
> localStorage Bearer token). See §6.

---

## 1. File map

### Core
| File | Responsibility |
| --- | --- |
| `src/utils/axiosInstance.ts` | **Rewritten** for cookie auth: `withCredentials`, transparent `/auth/refresh` retry on 401, no localStorage/Bearer. |
| `src/utils/authEvents.ts` | Decouples the interceptor from Redux (emits "unauthorized"). |
| `src/utils/getErrorMessage.ts` | Normalizes any error → one user-facing string (handles the backend's `{message}` / validation `{errors:[]}`). |
| `src/services/auth.service.ts` | All `/auth/*` + `/users/me` calls (rule (a)). |
| `src/validations/auth.schema.ts` | Zod schemas for every auth form (rule (c)). |
| `src/types/auth.types.ts` | `AuthState` (no token) + request/response payload types (rule (d)). |
| `src/types/index.ts` | `User` updated to match the backend model; `isAdminRole` helper. |

### State & hooks
| File | Responsibility |
| --- | --- |
| `src/features/auth/authSlice.ts` | `user`/`isAuthenticated`/`isLoading` + `setUser`/`clearAuth` + `restoreSession` thunk. |
| `src/hooks/useAuthActions.ts` | React Query mutations: `useLogin/useRegister/useLogout/useForgotPassword/useResetPassword/useVerifyEmail/useResendVerification`. |
| `src/hooks/useAuth.ts` | Convenience selector for the auth slice. |
| `src/components/auth/AuthInitializer.tsx` | Runs `restoreSession` on load + registers the 401 handler. |

### UI
| File | Responsibility |
| --- | --- |
| `src/components/form/RHFTextField.tsx` | MUI TextField bound to RHF (+ password show/hide). Reused everywhere (rule (m)). |
| `src/components/auth/AuthHeader.tsx` | Title/subtitle block for auth forms. |
| `src/components/auth/ResendVerificationForm.tsx` | Reusable resend-verification RHF form. |
| `src/components/auth/EmailVerificationBanner.tsx` | Storefront banner for signed-in, unverified users. |
| `src/pages/auth/LoginPage.tsx` | Sign in (+ redirect back to intended page). |
| `src/pages/auth/RegisterPage.tsx` | Create account. |
| `src/pages/auth/ForgotPasswordPage.tsx` | Request reset link. |
| `src/pages/auth/ResetPasswordPage.tsx` | Set new password from `?token=`. |
| `src/pages/auth/VerifyEmailPage.tsx` | Auto-verify from `?token=` (+ resend on failure). |

---

## 2. API contract (from the backend)

Base URL: `VITE_API_BASE_URL` (`http://localhost:8000/api`). All responses use
`{ success, message, data?, errors? }`. Tokens are set/cleared as cookies.

| Method | Endpoint | Body | Returns |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{name,email,password}` | `{user}` + cookies |
| POST | `/auth/login` | `{email,password}` | `{user}` + cookies |
| POST | `/auth/logout` | — | clears cookies |
| POST | `/auth/refresh` | — (refresh cookie) | `{user}` + rotated cookies |
| POST | `/auth/forgot-password` | `{email}` | generic message |
| POST | `/auth/reset-password` | `{token,password}` | message |
| POST | `/auth/verify-email` | `{token}` | message |
| POST | `/auth/resend-verification` | `{email}` | message |
| GET | `/users/me` | — | `{user}` (auth required) |

Email links point to `CLIENT_URL/verify-email?token=…` and
`CLIENT_URL/reset-password?token=…` — the matching frontend routes read `token`
from the query string.

---

## 3. How sessions work

```
App load → AuthInitializer → dispatch(restoreSession)
                                   │
                          GET /users/me
                          ┌────────┴─────────┐
                       200 user            401
                          │                  │ (interceptor) POST /auth/refresh
                     setUser              ┌───┴────┐
                  isAuthenticated      200        401
                                     retry /me   emitUnauthorized → clearAuth
                                        │              (logged-out; public pages
                                     setUser            still render, guards
                                                        redirect protected ones)
```

- **No token in JS.** The browser holds httpOnly cookies; `withCredentials`
  sends them. The slice tracks only the `user`.
- **Silent refresh.** A 401 on any request triggers one `/auth/refresh`; on
  success the original request is replayed. A single shared promise prevents a
  refresh stampede.
- **No hard redirect from Axios.** On refresh failure we clear auth and let the
  route guards (Feature 2) decide — so logged-out users keep browsing public
  pages.

---

## 4. Form pattern (rules (m), (c))

Every form is the same shape:

```tsx
const methods = useForm({ resolver: zodResolver(schema), defaultValues });
const action = useLogin(); // React Query mutation

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
    {action.isError && <Alert>{getErrorMessage(action.error)}</Alert>}
    <RHFTextField name="email" label="Email" />
    <Button type="submit" loading={action.isPending}>Submit</Button>
  </form>
</FormProvider>
```

`RHFTextField` reads `control` from `useFormContext`, renders errors inline, and
adds a show/hide toggle for `type="password"`.

---

## 5. How to test it

> Requires the backend running (`http://localhost:8000`) with working SMTP for
> the email flows. See §7.

1. `npm run dev`.
2. **Register** at `/register` → creates the account, signs you in, returns
   home. The amber **verification banner** appears (email unverified).
3. **Logout** (avatar menu) → cookies cleared; banner + menu reset.
4. **Login** at `/login` with the same credentials. Try a wrong password → the
   backend's "Invalid email or password" shows in an alert.
5. **Protected redirect**: while logged out, visit `/profile` → bounced to
   `/login`; after signing in you're returned to `/profile`.
6. **Forgot password** at `/forgot-password` → generic success message; check
   the email, open the link → `/reset-password?token=…` → set a new password →
   redirected to login.
7. **Verify email**: open the link from the registration email →
   `/verify-email?token=…` auto-verifies; the banner disappears. A bad/expired
   token shows a failure state with a **Resend** form.
8. **Session persistence**: stay logged in and refresh the page → you remain
   signed in (restored via `/users/me`, silently refreshed if needed).
9. **Admin**: sign in as a user whose role is `admin`/`superadmin` → the avatar
   menu shows **Admin Dashboard** and `/admin` is now reachable.

---

## 6. Deviations from the original brief (and why)

The brief described `authSlice` with an `accessToken` and an Axios instance that
reads a Bearer token from `localStorage` + calls `/auth/refresh-token`. The
**actual backend uses httpOnly cookies**, so:

- **`accessToken` removed from `authSlice`** — JS can't read an httpOnly cookie;
  storing it is impossible and misleading. The slice tracks `user` + flags only.
- **Axios rewritten** — no `localStorage`/Bearer; relies on `withCredentials`.
  Refresh endpoint corrected to **`/auth/refresh`** (was `/auth/refresh-token`).
- **`User` type updated** to match the backend model (`isEmailVerified`,
  `avatar: {url,publicId}`, `addresses`, `wishlist`, extra roles).

These are correctness fixes dictated by the real API, not style choices.

### MUI v9 note (continued)
Like `Stack`, **`Typography` no longer accepts system shorthand props** such as
`textAlign` — use `sx={{ textAlign: "center" }}`. Convention: layout/system
props go in `sx` for all MUI components in v9.

---

## 7. External setup required

- **Backend running** at `VITE_API_BASE_URL` with `CLIENT_URL` (in the backend
  `.env`) pointing at the frontend dev origin (e.g. `http://localhost:5173`) so
  CORS `credentials` + cookies work and email links target the right host.
- **SMTP configured** on the backend for register / forgot-password / verify /
  resend emails. Without it those flows still return success (the backend logs
  email errors) but no email is delivered — verify/reset tokens come from the
  email, so you'll need working mail (or grab the token from backend logs/DB) to
  exercise those two pages.
- **Cookies in dev:** backend dev cookies are `sameSite: lax` over http, which
  works for `localhost`. If you serve the frontend from a different host/port
  that becomes cross-site, the backend must run with prod cookie settings
  (`sameSite: none; secure`) over https.
