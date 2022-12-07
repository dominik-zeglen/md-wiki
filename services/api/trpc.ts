import { initTRPC } from "@trpc/server";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { ClaimVerifyResult } from "./middlewares/jwt";

export const t = initTRPC
  .context<{ event: APIGatewayProxyEventV2; user?: ClaimVerifyResult }>()
  .create();

export const procedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;
