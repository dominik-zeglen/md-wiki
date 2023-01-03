import { procedure, router } from "./trpc";
import * as yup from "yup";
import { jwtMiddleware } from "./middlewares/jwt";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../repository/siteSettings";

export const siteSettingsRouter = router({
  get: procedure.input(() => undefined).query(getSiteSettings),
  update: procedure
    .use(jwtMiddleware)
    .input((input) => {
      return yup
        .object({
          name: yup.string().required().min(3),
        })
        .validate(input);
    })
    .mutation(({ input }) => updateSiteSettings(input)),
});
