import { App } from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";
import { FrontendStack } from "./FrontendStack";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app.stack(ApiStack).stack(FrontendStack);
}
