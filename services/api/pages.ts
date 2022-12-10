import { procedure, router } from "./trpc";
import * as yup from "yup";
import {
  createPage,
  deletePage,
  getPage,
  getPages,
  updatePage,
} from "../repository/page";
import { jwtMiddleware } from "./middlewares/jwt";

export const pageRouter = router({
  get: procedure
    // yup validators must be recreated each time `input` method is evaluated
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .query((req) => getPage(req.input)),
  list: procedure.query(getPages),
  create: procedure
    .input((input) => {
      return yup
        .object({
          data: yup.object({
            slug: yup.string().min(3).required(),
            title: yup.string().min(3).required(),
            content: yup.string().required(),
          }),
        })
        .validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => {
      const user = req.ctx.user!.userName;

      return createPage({ ...req.input, user });
    }),
  update: procedure
    .input((input) => {
      return yup
        .object({
          slug: yup.string().min(3).required(),
          input: yup.object({
            title: yup.string().min(3).required(),
            content: yup.string().required(),
          }),
        })
        .validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => {
      const user = req.ctx.user!.userName;

      return updatePage({ user, slug: req.input.slug, data: req.input.input });
    }),
  delete: procedure
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => deletePage(req.input)),
});
