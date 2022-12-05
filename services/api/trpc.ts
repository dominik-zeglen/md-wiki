import { initTRPC } from "@trpc/server";

export const t = initTRPC.create();

export const procedure = t.procedure.use((data) => {
  data.ctx.userId =
    data.ctx.event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

  return data.next();
});
export const router = t.router;
