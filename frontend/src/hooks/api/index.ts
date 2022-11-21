import API from "@aws-amplify/api";
import { config } from "../../../awsConfig";

export * from "./pages";

API.configure({
  endpoints: [
    {
      name: "pages",
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION,
    },
  ],
});

if (!process.env.REACT_APP_API_URL) {
  throw new Error("REACT_APP_API_URL environment variable not set");
}
