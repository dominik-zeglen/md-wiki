import { getPages } from "../repository/page";
import { handler } from "../utils/handler";
import type { Selectable } from "kysely";
import { MdWikiPages } from "../repository/db.d";

export type GetPageListResponse = Array<Selectable<MdWikiPages>>;

export const main = handler<GetPageListResponse>(getPages);
