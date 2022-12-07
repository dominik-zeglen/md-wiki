import { Api, StackContext, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { cluster } = use(StorageStack);

  const api = new Api(stack, "Api", {
    cors: true,
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [cluster],
        environment: {
          DATABASE_NAME: cluster.defaultDatabaseName,
          SECRET_ARN: cluster.secretArn,
          CLUSTER_ARN: cluster.clusterArn,
        },
      },
    },
    routes: {
      "GET /trpc/{proxy+}": {
        function: "api/index.main",
      },
      "POST /trpc/{proxy+}": {
        function: "api/index.main",
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
