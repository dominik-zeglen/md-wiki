import {
  ReactStaticSite,
  use,
  StackContext,
} from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";

export function FrontendStack({ stack, app }: StackContext) {
  const { api } = use(ApiStack);

  const site = new ReactStaticSite(stack, "frontend", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.customDomainUrl || api.url,
      REACT_APP_REGION: app.region,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
