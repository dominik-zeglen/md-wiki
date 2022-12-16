import { Api, StackContext, use, Function } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }: StackContext) {
  const { cluster } = use(StorageStack);

  const trpc = new Function(stack, "trpcHandler", {
    permissions: [cluster, "cognito-idp:*"],
    handler: "api/index.main",
    environment: {
      SECRET: process.env.SECRET!,
      REGION: app.region,
      DATABASE_NAME: cluster.defaultDatabaseName,
      SECRET_ARN: cluster.secretArn,
      CLUSTER_ARN: cluster.clusterArn,
    },
  });

  const api = new Api(stack, "Api", {
    cors: true,
    defaults: {},
    routes: {
      "GET /trpc/{proxy+}": trpc,
      "POST /trpc/{proxy+}": trpc,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
