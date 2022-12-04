import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import urlJoin from "url-join";
import { config } from "../../../awsConfig";
import type { AppRouter } from "../../../../services/api/index";

export const trpc = createTRPCReact<AppRouter>();
export const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: urlJoin(config.apiGateway.URL!, "trpc"),
    }),
  ],
});
export const TRPCProvider = trpc.Provider;
