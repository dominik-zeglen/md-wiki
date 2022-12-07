import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import urlJoin from "url-join";
import API from "@aws-amplify/api";
import { config } from "../../../awsConfig";
import type { AppRouter } from "../../../../services/api/index";

export const trpc = createTRPCReact<AppRouter>();
export const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: urlJoin(config.apiGateway.URL!, "trpc"),
      headers: async () => {
        try {
          const credentials = await API.Auth?.currentSession();
          const token = credentials.getAccessToken().getJwtToken();

          return {
            authorization: `Bearer ${token}`,
          };
        } catch {
          return {};
        }
      },
    }),
  ],
});
export const TRPCProvider = trpc.Provider;
