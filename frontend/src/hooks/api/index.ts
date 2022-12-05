import API from "@aws-amplify/api";
import { config } from "../../../awsConfig";

API.configure({
  endpoints: [
    {
      name: "pages",
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION,
    },
    {
      name: "tags",
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION,
    },
    {
      name: "trpc",
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION,
    },
  ],
});
export const post = (url: string, body: any) => API.post("trpc", url, body);
export const get = (url: string, body: any) => API.get("trpc", url, body);
