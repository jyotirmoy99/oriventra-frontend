import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// useDebounce
// ---------------------------------------------------------------------------
// Returns a debounced copy of a fast-changing value. The returned value only
// updates after `delay` ms have passed without a new change. Used by the
// search input (Navbar now, product search in Feature 5) to avoid firing on
// every keystroke.
// ---------------------------------------------------------------------------

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    // Cancel the pending update if `value` changes again before `delay`.
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
