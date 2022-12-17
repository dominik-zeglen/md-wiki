import { procedure, router } from "./trpc";
import * as yup from "yup";
import { jwtMiddleware } from "./middlewares/jwt";
import {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../repository/user";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  get: procedure
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .query(({ input }) => getUser(input)),
  list: procedure.input(() => null).query(getUsers),
  create: procedure
    .use(jwtMiddleware)
    .input((input) => {
      return yup
        .object({
          username: yup.string().min(3).required(),
          password: yup.string().min(6).required(),
        })
        .validate(input);
    })
    .mutation(({ input }) => createUser(input)),
  update: procedure
    .use(jwtMiddleware)
    .input((input) => {
      return yup
        .object({
          user: yup.string().required(),
          data: yup.object({
            displayName: yup.string(),
            password: yup.string().min(6),
          }),
        })
        .validate(input);
    })
    .mutation(({ input, ctx }) => {
      if (ctx.user.username === input.user) {
        return updateUser(input);
      }

      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }),
  delete: procedure
    .use(jwtMiddleware)
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .mutation(({ input }) => deleteUser(input)),
  me: procedure
    .use(jwtMiddleware)
    .input(() => null)
    .query(async ({ ctx }) => getUser(ctx.user!.username)),
});
