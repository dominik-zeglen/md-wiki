import { procedure, router } from "./trpc";
import * as yup from "yup";
import { jwtMiddleware } from "./middlewares/jwt";
import { getUser, getUserToken, verifyUser } from "../repository/user";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  token: procedure
    .input((input) => {
      return yup
        .object({
          email: yup.string().required(),
          password: yup.string().required(),
          trusted: yup.boolean().optional(),
        })
        .validateSync(input);
    })
    .mutation(async ({ input }) => {
      if (await verifyUser(input.email, input.password)) {
        const token = getUserToken(input.email, input.trusted ? null : 3600);
        const user = await getUser(input.email);

        return {
          token,
          user,
        };
      }

      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }),
  me: procedure
    .use(jwtMiddleware)
    .input(() => null)
    .query(async ({ ctx }) => getUser(ctx.user!.email)),
});
