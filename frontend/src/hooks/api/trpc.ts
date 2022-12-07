import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import urlJoin from "url-join";
import API from "@aws-amplify/api";
import { Signer } from "@aws-amplify/core";
import { config } from "../../../awsConfig";
import type { AppRouter } from "../../../../services/api/index";

export const trpc = createTRPCReact<AppRouter>();
export const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: urlJoin(config.apiGateway.URL!, "trpc"),
      fetch: async (url, init) => {
        const credentials = await API.Credentials.get();
        const creds = {
          secret_key: credentials.secretAccessKey,
          access_key: credentials.accessKeyId,
          session_token: credentials.sessionToken,
        };

        const req = Signer.signUrl(url, creds);

        return fetch(req);
      },
    }),
  ],
});
export const TRPCProvider = trpc.Provider;
