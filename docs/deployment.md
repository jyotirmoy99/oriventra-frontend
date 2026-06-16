# Deployment & CI/CD (Vercel)

How the Oriventra **frontend** is deployed to Vercel with automatic deploys on
merge to `main`, plus a GitHub Actions quality gate.

---

## 1. Architecture

```
 PR opened ──► GitHub Actions CI (lint · type-check · build)  ─┐ required check
        └────► Vercel Preview deploy (unique URL per PR)        │
                                                                ▼
 merge to main ──► Vercel Production deploy (your live URL)
```

- **Vercel Git Integration** does the deploying: every push/merge to **`main`**
  is a **Production** deploy; every **PR** gets its own **Preview** deploy. No
  deploy scripts or tokens needed.
- **GitHub Actions** (`.github/workflows/ci.yml`) runs lint + type-check + build
  on PRs and pushes. Marked **required** in branch protection, so only green code
  reaches `main` — which Vercel then ships.

The frontend is its **own GitHub repo** (`oriventra-frontend`), so the repo root
*is* the Vite app — no monorepo "Root Directory" needed.

---

## 2. Files in this repo that drive deployment

| File | Purpose |
| --- | --- |
| `vercel.json` | Vite framework + **SPA rewrite** + asset caching (see §5). |
| `.nvmrc` | Pins Node `22` for Vercel, CI, and local `nvm` (Vite 8 needs ≥20.19/≥22.13). |
| `.github/workflows/ci.yml` | CI: `npm ci` → `lint` → `tsc -b --noEmit` → `build`. |
| `.env.example` | Documents the required `VITE_*` build variables. |

---

## 3. One-time setup

### a. Connect Vercel
1. [vercel.com](https://vercel.com) → sign in with **GitHub** → **Add New → Project**.
2. Import **`jyotirmoy99/oriventra-frontend`**.
3. Framework preset auto-detects **Vite**; **Root Directory = `./`**.
4. Build command `npm run build`, output `dist` (auto-filled).
5. Add **Environment Variables** (§4), then **Deploy**.
6. Settings → Git: confirm the **Production Branch** is `main`.

### b. Require CI before merge
GitHub repo → **Settings → Branches → Add branch protection rule** for `main`:
- ✅ Require status checks to pass → select **“Lint · type-check · build”**
  (it appears in the list after CI has run at least once).
- ✅ (recommended) Require a pull request before merging.

After this, the everyday flow is just: branch → PR (preview + CI) → merge → live.

---

## 4. Environment variables

`VITE_*` variables are **inlined at build time** and are **public** (never put
secrets here). Set them in Vercel → Project → Settings → Environment Variables,
for **Production** and **Preview**:

| Variable | Example | Notes |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://api.yourdomain.com/api/v1` | Deployed backend URL incl. `/api/v1`. **Not** localhost. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` / `pk_live_…` | Publishable key only. |

Changing an env var requires a **redeploy** to take effect (Vercel offers a
one-click redeploy).

---

## 5. Why `vercel.json` has a rewrite

The app uses React Router (`createBrowserRouter`) for client-side routing. Static
hosts return **404** for unknown paths, so refreshing or deep-linking
`/products`, `/orders/123`, etc. would break. The rewrite makes every path serve
`index.html`, and the router takes over:

```json
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
```

Static files (e.g. `/assets/*.js`) are matched **first**, so assets are
unaffected and get a long `immutable` cache header (they're content-hashed).

---

## 6. Backend dependencies (already configured)

Because auth uses **httpOnly cookies** and the frontend (Vercel domain) differs
from the backend domain, the **backend** must:
- CORS `origin: <vercel-url>` + `credentials: true`,
- issue cookies with `SameSite=None; Secure`,
- set `CLIENT_URL` to the Vercel URL (used for Stripe success/cancel + emails).

> This is handled on the backend. If logins or Stripe redirects ever fail in
> production, re-check these three.

---

## 7. Do we need a Dockerfile?

**No.** Vercel is not a container host — it runs `npm run build` in its own build
environment and serves `dist/` from its global CDN. A Dockerfile would be ignored.

A Dockerfile is only relevant when deploying to a **container platform** (Cloud
Run, ECS/Fargate, Kubernetes, Fly.io, Render/Railway in Docker mode) or
self-hosting behind nginx — most likely for the **backend**, not this SPA.

---

## 8. Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Build fails on Vercel but works locally | Node mismatch → confirm `.nvmrc` (22) is committed; check the build log. |
| 404 on refreshing a non-home route | `vercel.json` rewrite missing/not deployed. |
| App loads but API calls fail (CORS / 401) | `VITE_API_BASE_URL` wrong, or backend CORS/cookie config (§6). |
| Login works locally, not in prod | Cross-site cookies — backend `SameSite=None; Secure` + CORS `credentials` (§6). |
| Env var change has no effect | `VITE_*` are build-time — **redeploy** after changing. |
| CI required-check never appears | Let CI run once (open a PR), then it shows in branch-protection settings. |

---

## 9. Local production preview

```bash
cd frontend
npm run build     # tsc -b && vite build  → dist/
npm run preview   # serve dist/ locally to sanity-check the prod bundle
```
