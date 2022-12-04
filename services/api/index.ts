import trpc, { initTRPC } from "@trpc/server";
import {
  CreateAWSLambdaContextOptions,
  awsLambdaRequestHandler,
} from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { pageRouter } from "./pages";

export const t = initTRPC.create();
const appRouter = t.router({
  pages: pageRouter,
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

export const main = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
