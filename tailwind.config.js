/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // Dark mode is driven by the `dark` class set on <html> by ThemeModeProvider,
  // so Tailwind's dark: variants stay in lock-step with the MUI theme.
  darkMode: "class",
  theme: {
    extend: {
      // These map to the CSS custom properties written by ThemeModeProvider,
      // so `bg-background`, `text-foreground`, `text-primary`, etc. always
      // resolve to the same color MUI is using in the current mode.
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        paper: "var(--color-paper)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
      },
    },
  },
  plugins: [],
};
