import { deletePage } from "repository/page";
import { handler } from "../utils/handler";

export const main = handler(async (event) => {
  const slug = event.pathParameters!.slug!;

  // const page = getPage()

  // if (page && !page.canBeDeleted) {
  //   throw new Error(`Page ${slug} cannot be deleted`);
  // }

  await deletePage(slug);

  return { ok: true };
});
