import { Api, StackContext, Function } from "@serverless-stack/resources";

export function ApiStack({ stack, app }: StackContext) {
  const trpc = new Function(stack, "trpcHandler", {
    handler: "api/index.main",
    environment: {
      SECRET: process.env.SECRET!,
      REGION: app.region,
      DB_USER: process.env.DB_USER!,
      DB_PASSWORD: process.env.DB_PASSWORD!,
      DB_HOST: process.env.DB_HOST!,
      DB_PORT: process.env.DB_PORT!,
      DB_NAME: process.env.DB_NAME!,
      DB_URL: process.env.DB_URL!,
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
