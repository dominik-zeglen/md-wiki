import { Api, StackContext, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { cluster } = use(StorageStack);

  const api = new Api(stack, "Api", {
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
      "GET /health": {
        authorizer: "none",
        function: "functions/health.main",
      },
      "POST /pages": "functions/create.main",
      "GET /pages": {
        authorizer: "none",
        function: "functions/list.main",
      },
      "GET /pages/{slug}": {
        authorizer: "none",
        function: "functions/get.main",
      },
      "PATCH /pages/{slug}": "functions/update.main",
      "DELETE /pages/{slug}": "functions/delete.main",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
