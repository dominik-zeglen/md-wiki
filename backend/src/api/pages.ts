import { procedure, router } from "./trpc";
import * as yup from "yup";
import {
  createPage,
  deletePage,
  getPage,
  getPageReferences,
  getPages,
  searchPage,
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
  list: procedure.input(() => null).query(getPages),
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
      const user = req.ctx.user!.username;

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
      const user = req.ctx.user!.username;

      return updatePage({ user, slug: req.input.slug, data: req.input.input });
    }),
  delete: procedure
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => deletePage(req.input)),
  search: procedure
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .query((req) => searchPage(req.input)),
  references: procedure
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .query((req) => getPageReferences(req.input)),
});
