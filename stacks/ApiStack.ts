import { Api, StackContext, use } from "@serverless-stack/resources";
import { AuthStack } from "./AuthStack";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }: StackContext) {
  const { auth } = use(AuthStack);
  const { cluster } = use(StorageStack);

  const api = new Api(stack, "Api", {
    cors: true,
    defaults: {
      function: {
        permissions: [cluster],
        environment: {
          REGION: app.region,
          DATABASE_NAME: cluster.defaultDatabaseName,
          SECRET_ARN: cluster.secretArn,
          CLUSTER_ARN: cluster.clusterArn,
          COGNITO_POOL_ID: auth.userPoolId,
        },
      },
    },
    routes: {
      "GET /trpc/{proxy+}": "api/index.main",
      "POST /trpc/{proxy+}": "api/index.main",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
