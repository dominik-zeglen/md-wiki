import { handler } from "../../utils/handler";
import { getPagesWithTag, getTag } from "../../repository/tag";
import type { MdWikiTags, MdWikiPages } from "../../repository/db.d";
import type { Selectable } from "kysely";

export interface GetTagResponse extends Selectable<MdWikiTags> {
  pages: Array<Selectable<MdWikiPages>>;
}

export const main = handler<GetTagResponse>(async (event) => {
  const id = event.pathParameters!.id!;

  try {
    const tag = await getTag(id);

    if (!tag) {
      throw new Error(`Tag #${id} does not exist`);
    }

    const pages = await getPagesWithTag(id);

    return {
      ...tag,
      pages,
    };
  } catch (err) {
    throw err;
  }
});
