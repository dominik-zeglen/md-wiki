import { initTRPC } from "@trpc/server";
import type { ClaimVerifyResult } from "./middlewares/jwt";
import { BaseRequest } from "koa";

export const t = initTRPC
  .context<{ request: BaseRequest; user?: ClaimVerifyResult }>()
  .create();

export const procedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;
