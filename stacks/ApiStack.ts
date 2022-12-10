import { Api, StackContext, use, Function } from "@serverless-stack/resources";
import { AuthStack } from "./AuthStack";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }: StackContext) {
  const { auth } = use(AuthStack);
  const { cluster } = use(StorageStack);

  const trpc = new Function(stack, "trpcHandler", {
    permissions: [cluster, "cognito-idp:*"],
    handler: "api/index.main",
    environment: {
      REGION: app.region,
      DATABASE_NAME: cluster.defaultDatabaseName,
      SECRET_ARN: cluster.secretArn,
      CLUSTER_ARN: cluster.clusterArn,
      COGNITO_POOL_ID: auth.userPoolId,
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
