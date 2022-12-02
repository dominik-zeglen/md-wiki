import { handler } from "../utils/handler";
import { getPage } from "../repository/page";
import type { Selectable } from "kysely";
import { MdWikiPages, MdWikiTags } from "../repository/db.d";

export interface GetPageResponse extends Selectable<MdWikiPages> {
  tags: Array<Selectable<Pick<MdWikiTags, "id" | "name">>>;
}

export const main = handler<GetPageResponse>(async (event) => {
  const slug = event.pathParameters!.slug;

  if (!slug) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  try {
    const page = await getPage(slug);

    if (!page) {
      throw new Error(`Page ${slug} does not exist`);
    }

    return page;
  } catch (err) {
    throw err;
  }
});
