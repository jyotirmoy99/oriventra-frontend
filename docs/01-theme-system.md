# Feature 1 — Theme System

Light/dark theming for Oriventra built on **MUI's `ThemeProvider`**, with a
single set of brand tokens shared between **MUI** and **Tailwind**, persisted to
`localStorage`, and toggled with an animated (Framer Motion) header button.

---

## 1. File map

| File | Responsibility |
| --- | --- |
| `src/theme/tokens.ts` | Single source of truth for brand colors (light + dark), the brand gradient, and the `localStorage` key. Plain data, no React. |
| `src/theme/createAppTheme.ts` | Factory that turns tokens for a mode into a full MUI `Theme` (palette, typography, shape, component overrides). |
| `src/theme/ThemeModeContext.ts` | The React context object + its value type. Kept separate so consumers don't import the provider (Fast-Refresh friendly). |
| `src/theme/ThemeModeProvider.tsx` | Owns mode state. Wires MUI `ThemeProvider` + `CssBaseline`, persists to `localStorage`, and writes CSS variables onto `<html>` for Tailwind. |
| `src/hooks/useThemeMode.ts` | Typed hook to read `{ mode, toggleMode, setMode }`. Throws if used outside the provider. |
| `src/components/common/ThemeToggleButton.tsx` | Header icon button; swaps sun/moon with a rotate+fade animation. |
| `src/index.css` | Tailwind directives + static CSS-variable fallbacks (no FOUC before React mounts). |
| `tailwind.config.js` | `darkMode: "class"` + colors mapped to the CSS variables. |
| `src/app/providers.tsx` | Mounts `ThemeModeProvider` inside Redux + Query providers. |

---

## 2. How it flows

```
getInitialMode()                      // localStorage → OS preference → "light"
      │
      ▼
ThemeModeProvider  ── useState(mode)
      │
      ├─ useMemo → createAppTheme(mode) ─────────► <MuiThemeProvider> + <CssBaseline>
      │
      └─ useEffect(mode):
            • localStorage.setItem(KEY, mode)            // persistence
            • applyCssVariables(mode):                   // Tailwind bridge
                 <html> style --color-* = token
                 <html> data-theme = mode
                 <html>.classList.toggle("dark")
                 <html> style.colorScheme = mode
```

When the toggle button fires `toggleMode()`, `mode` flips → the `useMemo`
rebuilds the MUI theme **and** the `useEffect` rewrites the CSS variables, so MUI
components (`sx`, `palette`) and Tailwind utilities (`bg-background`,
`text-foreground`, `text-primary`) update together in one render.

### The shared-token bridge (key idea)

`tokens.ts` is consumed twice:

1. **MUI** — `createAppTheme` reads tokens into `palette`.
2. **Tailwind** — `ThemeModeProvider` writes the same tokens as `--color-*` CSS
   variables, and `tailwind.config.js` maps utilities to those variables.

So there is exactly **one** definition of "primary purple", and both styling
systems always agree in either mode.

---

## 3. Libraries / APIs used

- **`@mui/material/styles` `createTheme` / `ThemeProvider`** — builds and
  supplies the theme. We set `palette.mode`, `typography`, `shape.borderRadius`,
  and `components` overrides (buttons without uppercase, bordered cards, small
  dense text fields).
- **`CssBaseline`** — MUI's cross-browser reset; also paints the `background` /
  `text` colors from the active theme onto `<body>`.
- **`framer-motion` `AnimatePresence` + `motion.span`** — animates the
  sun/moon icon swap (`mode="wait"` so the old icon exits before the new enters).
- **React** — `useState` (mode), `useMemo` (stable theme + context value),
  `useEffect` (persist + CSS vars), `useCallback` (stable `toggle`/`set`),
  `createContext`/`useContext` (distribution), `React.memo` (toggle button).
- **`window.matchMedia('(prefers-color-scheme: dark)')`** — first-visit default.

---

## 4. Public API (how later features use it)

```tsx
import { useThemeMode } from "../hooks/useThemeMode";

const { mode, toggleMode, setMode } = useThemeMode();
// mode: "light" | "dark"
```

```tsx
// Drop the toggle anywhere (it will live in the Navbar in Feature 2):
import ThemeToggleButton from "../components/common/ThemeToggleButton";
<ThemeToggleButton />
```

```tsx
// Brand gradient for hero/promo sections:
import { brandGradient } from "../theme/tokens";
<Box sx={{ background: brandGradient }} />
```

Styling either way resolves to the same palette:

```tsx
<Box sx={{ bgcolor: "background.default", color: "text.primary" }} /> // MUI
<div className="bg-background text-foreground" />                      // Tailwind
```

---

## 5. MUI v9 gotcha (important, project-wide)

This project resolved **`@mui/material` v9**. In v9 the `Stack` component accepts
**only** these props: `direction`, `spacing`, `divider`, `useFlexGap`, `sx`
(+ `component`). Layout props such as `alignItems`, `justifyContent`,
`flexWrap`, and `width` are **no longer passed through** — they must go in `sx`:

```tsx
// ❌ v9 type error
<Stack direction="row" alignItems="center" flexWrap="wrap" width="100%" />

// ✅ correct
<Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", width: "100%" }} />
```

Convention going forward: **`Stack` for direction/spacing only; everything else
via `sx` (or use `Box` with `sx`)**.

---

## 6. How to test it

1. `npm run dev`, open the app.
2. The Home page shows a temporary theme demo (replaced by the real Home page in
   Feature 4). Click the sun/moon button — note the icon's rotate+fade.
3. Verify in dark mode: background, text, the MUI cards/buttons/chip, **and** the
   Tailwind-only card all switch together.
4. Reload the page — the chosen mode persists (`localStorage` key
   `oriventra-theme-mode`).
5. Clear that key and set your OS to dark mode, reload — it should open in dark.

---

## 7. External setup required

None for this feature. (Stripe key and other integrations are flagged when their
features arrive.)
