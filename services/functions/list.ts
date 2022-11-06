import { getPages } from "repository/page";
import { handler } from "../utils/handler";

export const main = handler(getPages);
