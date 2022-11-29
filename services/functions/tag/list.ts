import type { Selectable } from "kysely";
import { MdWikiTags } from "../../repository/db.d";
import { getTags } from "../../repository/tag";
import { handler } from "../../utils/handler";

export type GetTagListResponse = Array<Selectable<MdWikiTags>>;

export const main = handler<GetTagListResponse>(getTags);
