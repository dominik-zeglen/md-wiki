import { getTags } from "repository/tag";
import { handler } from "../../utils/handler";

export const main = handler(getTags);
