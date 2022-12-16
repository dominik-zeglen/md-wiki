import { procedure, router } from "./trpc";
import * as yup from "yup";
import {
  attachTagToPage,
  createTag,
  deleteTag,
  getPagesWithTag,
  getTag,
  getTags,
  unattachTagFromPage,
  updateTag,
} from "../repository/tag";
import { markPageAsUpdated } from "../repository/page";
import { jwtMiddleware } from "./middlewares/jwt";
import {
  getUser,
  getUserToken,
  verifyUser,
  verifyUserToken,
} from "../repository/user";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  token: procedure
    .input((input) => {
      return yup
        .object({
          email: yup.string().required(),
          password: yup.string().required(),
        })
        .validateSync(input);
    })
    .mutation(async ({ input }) => {
      if (await verifyUser(input.email, input.password)) {
        const token = getUserToken(input.email);
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
    .query(async ({ ctx }) => getUser(ctx.user!.email)),
});
