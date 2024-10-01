import {
  createContext,
  PropsWithChildren,
  useState,
  useEffect,
  Suspense,
  lazy,
} from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 120000,
      refetchOnWindowFocus: false,
      retry: 2,
      refetchOnMount: false,
    },
  },
});

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

export const QueryContext = createContext<undefined>(undefined);

const QueryProvider = ({ children }: PropsWithChildren) => {
  const [showDevtools, setShowDevtools] = useState<boolean>(false);

  useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <QueryContext.Provider value={undefined}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )}
      </QueryClientProvider>
    </QueryContext.Provider>
  );
};

export default QueryProvider;
