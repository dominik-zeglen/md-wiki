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

export const tagRouter = router({
  get: procedure
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .query(async (req) => {
      const tag = await getTag(req.input);

      if (!tag) {
        throw new Error(`Tag #${req.input} does not exist`);
      }

      const pages = await getPagesWithTag(req.input);

      return {
        ...tag,
        pages,
      };
    }),
  list: procedure.input(() => null).query(getTags),
  create: procedure
    .input((input) => {
      return yup
        .object({
          data: yup.object({
            name: yup.string().min(3).required(),
          }),
        })
        .validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => {
      const user = req.ctx.user!.username;

      return createTag({ ...req.input, user });
    }),
  update: procedure
    .input((input) => {
      return yup
        .object({
          id: yup.string().required(),
          data: yup.object({
            name: yup.string().min(3).required(),
          }),
        })
        .validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => {
      const user = req.ctx.user!.username;

      return updateTag({ user, id: req.input.id, data: req.input.data });
    }),
  delete: procedure
    .input((input) => {
      return yup.string().required().validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => deleteTag(req.input)),
  attach: procedure
    .input((input) => {
      return yup
        .object({
          tag: yup.string().required(),
          page: yup.string().required(),
        })
        .validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => {
      const user = req.ctx.user!.username;

      return Promise.all([
        markPageAsUpdated({ slug: req.input.page, user }),
        attachTagToPage(req.input.tag, req.input.page),
      ]);
    }),
  unattach: procedure
    .input((input) => {
      return yup
        .object({
          tag: yup.string().required(),
          page: yup.string().required(),
        })
        .validateSync(input);
    })
    .use(jwtMiddleware)
    .mutation((req) => {
      const user = req.ctx.user!.username;

      return Promise.all([
        markPageAsUpdated({ slug: req.input.page, user }),
        unattachTagFromPage(req.input.tag, req.input.page),
      ]);
    }),
});
