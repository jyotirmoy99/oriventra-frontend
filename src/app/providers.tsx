import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "../store";
import ThemeModeProvider from "../theme/ThemeModeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* ThemeModeProvider supplies the MUI theme + CssBaseline to the whole app */}
        <ThemeModeProvider>{children}</ThemeModeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
