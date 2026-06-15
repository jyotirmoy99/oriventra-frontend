// ---------------------------------------------------------------------------
// authEvents
// ---------------------------------------------------------------------------
// Tiny decoupling layer between the Axios interceptor and the Redux store. The
// interceptor can't import the store (that would create a circular dependency:
// store → slices, services → axios → store). Instead it emits an "unauthorized"
// signal here, and the app registers a handler at startup that clears auth
// state. Keeps Axios free of any app-state imports.
// ---------------------------------------------------------------------------

type UnauthorizedHandler = () => void;

let handler: UnauthorizedHandler | null = null;

/** Register (or clear) the handler run when a session is irrecoverably lost. */
export const setUnauthorizedHandler = (h: UnauthorizedHandler | null): void => {
  handler = h;
};

/** Called by the Axios interceptor when refresh fails. */
export const emitUnauthorized = (): void => {
  handler?.();
};
