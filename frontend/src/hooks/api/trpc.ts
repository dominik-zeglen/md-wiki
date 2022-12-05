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
        const credentials = await API.Credentials.get();
        const source = await API.Credentials.getCredSource();
        const shear = API.Credentials.shear(credentials);
        console.log({ credentials, source, shear });

        return {
          // Authorization: `AWS4-HMAC-SHA256 Credential=ASIA2BS23TEDWKJOZBAU/20221204/eu-west-1/execute-api/aws4_request, SignedHeaders=host;x-amz-date;x-amz-security-token, Signature=23006cf84e7c5772beb347dbed9c61f3ce8faea3a42bb5a307d882f88318b975`
          Authorization: shear.accessKeyId,
          "x-amz-security-token": JSON.stringify(credentials),
        };
      },
    }),
  ],
});
export const TRPCProvider = trpc.Provider;
