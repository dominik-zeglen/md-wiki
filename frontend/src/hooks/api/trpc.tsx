import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import urlJoin from "url-join";
import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { config } from "../../../awsConfig";
import type { AppRouter } from "../../../../services/api/index";
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
  const [auth] = useAuthAtom();
  const token = auth?.token;
  const client = React.useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: urlJoin(config.apiGateway.URL!, "trpc"),
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
