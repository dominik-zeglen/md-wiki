import { procedure, router } from "./trpc";
import * as yup from "yup";
import { jwtMiddleware } from "./middlewares/jwt";
import {
  getSiteSettings,
  updateSiteSettings,
  updateS3Settings,
  deleteS3Settings,
  getS3Settings,
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
  s3: procedure
    .use(jwtMiddleware)
    .input(() => undefined)
    .query(async () => {
      const settings = await getS3Settings();

      return {
        bucket: settings.s3BucketName,
      };
    }),
  updateS3: procedure
    .use(jwtMiddleware)
    .input((input) => {
      return yup
        .object({
          s3AccessKeyId: yup.string().required(),
          s3BucketName: yup.string().required(),
          s3Region: yup.string().required(),
          s3SecretAccessKey: yup.string().required(),
        })
        .validate(input);
    })
    .mutation(({ input }) => updateS3Settings(input)),
  deleteS3: procedure
    .use(jwtMiddleware)
    .input(() => undefined)
    .mutation(deleteS3Settings),
});
