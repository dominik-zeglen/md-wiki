import trpc, { initTRPC } from "@trpc/server";
import { pageRouter } from "./pages";
import { tagRouter } from "./tags";
import { authRouter } from "./auth";

export const t = initTRPC.create();
export const appRouter = t.router({
  pages: pageRouter,
  tags: tagRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = trpc.inferRouterOutputs<AppRouter>;
export type AppRouterInputs = trpc.inferRouterInputs<AppRouter>;
