import { Cognito, StackContext, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function AuthStack({ stack, app }: StackContext) {
  const { cluster } = use(StorageStack);
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
    triggers: {
      postAuthentication: {
        permissions: [cluster],
        handler: "functions/postAuth.main",
        environment: {
          REGION: app.region,
          DATABASE_NAME: cluster.defaultDatabaseName,
          SECRET_ARN: cluster.secretArn,
          CLUSTER_ARN: cluster.clusterArn,
        },
      },
    },
  });

  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId!,
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    auth,
  };
}
