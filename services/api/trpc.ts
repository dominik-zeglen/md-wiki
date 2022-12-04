import { initTRPC } from "@trpc/server";
import {
  CreateAWSLambdaContextOptions,
  awsLambdaRequestHandler,
} from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

export const t = initTRPC.create();

export const procedure = t.procedure;
export const router = t.router;
