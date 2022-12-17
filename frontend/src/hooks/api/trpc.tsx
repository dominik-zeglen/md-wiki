import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import urlJoin from "url-join";
import React from "react";
import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@api";
import { useAuthAtom } from "../auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: "always",
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

export const trpc = createTRPCReact<AppRouter>();
export const TRPCProvider: React.FC = ({ children }) => {
  const [token] = useAuthAtom();
  const client = React.useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: urlJoin(process.env.REACT_APP_API_URL ?? "/", "trpc"),
            headers: token
              ? {
                  authorization: `Bearer ${token}`,
                }
              : {},
          }),
        ],
      }),
    [token]
  );

  return (
    <trpc.Provider queryClient={queryClient} client={client}>
      {children}
    </trpc.Provider>
  );
};
