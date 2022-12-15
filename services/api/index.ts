import trpc, { initTRPC } from "@trpc/server";
import {
  CreateAWSLambdaContextOptions,
  awsLambdaRequestHandler,
} from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { pageRouter } from "./pages";
import { tagRouter } from "./tags";
import { authRouter } from "./auth";

export const t = initTRPC.create();
const appRouter = t.router({
  pages: pageRouter,
  tags: tagRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = trpc.inferRouterOutputs<AppRouter>;

const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({
  event,
  context,
});
export type RequestContext = ReturnType<typeof createContext>;

export const main = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
