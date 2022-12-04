import { procedure, router } from "./trpc";
import * as yup from "yup";
import { getPage } from "../repository/page";

export const pageRouter = router({
  get: procedure
    .input((slug) => slug as string)
    .query((req) => getPage(req.input)),
});
