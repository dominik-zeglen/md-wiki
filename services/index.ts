import Koa from "koa";
import cors from "@koa/cors";
import logger from "koa-logger";
import { appRouter } from "./api";
import { nodeHTTPRequestHandler } from "@trpc/server/adapters/node-http";

const app = new Koa();
const adapter: Koa.Middleware = (ctx, next) => {
  const { req, res } = ctx;
  const trpcPath = "/trpc";

  if (req.url?.startsWith(trpcPath)) {
    const path = (req.url || "").split("?")[0];
    const endpoint = path.slice((trpcPath + "/").length);

    res.statusCode = 201;

    return nodeHTTPRequestHandler({
      router: appRouter,
      createContext: () => ({
        request: req,
      }),
      req,
      res,
      path: endpoint,
    });
  } else {
    return next();
  }
};

app.use(cors());
app.use(logger());
app.use(adapter);
app.listen(process.env.PORT ?? 8000);
