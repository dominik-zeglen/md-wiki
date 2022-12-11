import { procedure, router } from "./trpc";
import * as yup from "yup";
import {
  createPage,
  deletePage,
  getPage,
  getPages,
  searchPage,
  updatePage,
} from "../repository/page";
import { jwtMiddleware } from "./middlewares/jwt";
import { remark } from "remark";
import directivePlugin from "remark-directive";
import { visit } from "unist-util-visit";
import { pipe, toArray, uniq } from "@fxts/core";

function pageReferencePlugin(cb: (slug: string) => void) {
  return () => (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name !== "page") return;

        const attributes = node.attributes || {};
        const slug = attributes.id;

        if (!slug) return;

        cb(slug);
      }
    });
  };
}

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
      let slugs: string[] = [];

      remark()
        .use([directivePlugin, pageReferencePlugin((slug) => slugs.push(slug))])
        .processSync(req.input.input.content);
      const uniqueSlugs = pipe(slugs, uniq, toArray);

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
});
