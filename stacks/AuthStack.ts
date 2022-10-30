import { Cognito, StackContext, use } from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack, app }: StackContext) {
  const { api } = use(ApiStack);

  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId!,
    UserPoolClientId: auth.userPoolClientId,
  });

  // Return the auth resource
  return {
    auth,
  };
}
