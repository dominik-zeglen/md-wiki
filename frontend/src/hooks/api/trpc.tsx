import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import urlJoin from "url-join";
import React from "react";
import type { AppRouter } from "@api";
import { useAlert } from "react-alert";
import { useAuthAtom } from "../auth";

export const trpc = createTRPCReact<AppRouter>();
export const TRPCProvider: React.FC = ({ children }) => {
  const [token] = useAuthAtom();
  const { show } = useAlert();
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

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: "always",
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: Infinity,
            onError: (err) => {
              if (
                ["meta", "shape", "data"].every((key) => !(err as any)[key])
              ) {
                show("Connection problem", { type: "error" });
              }
              show("Oops", { type: "error" });
            },
          },
        },
      }),
    []
  );

  return (
    <trpc.Provider queryClient={queryClient} client={client}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
