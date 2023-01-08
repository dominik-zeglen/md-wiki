import trpc, { initTRPC } from "@trpc/server";
import { pageRouter } from "./pages";
import { tagRouter } from "./tags";
import { userRouter } from "./users";
import { authRouter } from "./auth";
import { siteSettingsRouter } from "./siteSettings";
import { upload } from "./upload";

export const t = initTRPC.create();
export const appRouter = t.router({
  pages: pageRouter,
  tags: tagRouter,
  users: userRouter,
  auth: authRouter,
  site: siteSettingsRouter,
  upload,
});

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = trpc.inferRouterOutputs<AppRouter>;
export type AppRouterInputs = trpc.inferRouterInputs<AppRouter>;
