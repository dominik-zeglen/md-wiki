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

      "POST /tags": "functions/tag/create.main",
      "GET /tags": {
        authorizer: "none",
        function: "functions/tag/list.main",
      },
      "GET /tags/{id}": {
        authorizer: "none",
        function: "functions/tag/get.main",
      },
      "POST /tags/{id}/attach": "functions/tag/attach.main",
      "POST /tags/{id}/unattach": "functions/tag/unattach.main",
      // "PATCH /tags/{id}": "functions/update.main",
      "DELETE /tags/{id}": "functions/tag/delete.main",
      "GET /trpc/{proxy+}": {
        authorizer: "none",
        function: "api/index.main",
        payloadFormatVersion: "2.0",
      },
      "POST /trpc/{proxy+}": {
        authorizer: "none",
        function: "api/index.main",
        payloadFormatVersion: "2.0",
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
