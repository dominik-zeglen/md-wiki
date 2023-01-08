import { procedure } from "./trpc";
import { jwtMiddleware } from "./middlewares/jwt";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Settings } from "../repository/siteSettings";
import { v4 } from "uuid";
import * as yup from "yup";

export const upload = procedure
  .use(jwtMiddleware)
  .input((input) => yup.string().required().validate(input))
  .mutation(async ({ input }) => {
    const settings = await getS3Settings();

    if (
      [
        settings.s3AccessKeyId,
        settings.s3BucketName,
        settings.s3Region,
        settings.s3SecretAccessKey,
      ].some((field) => !field)
    ) {
      throw new Error("AWS S3 bucket upload is not configured");
    }

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: settings.s3AccessKeyId!,
        secretAccessKey: settings.s3SecretAccessKey!,
      },
      region: settings.s3Region!,
    });

    const filename = [v4(), input.split("/")[1]].join(".");

    const command = new PutObjectCommand({
      Bucket: settings.s3BucketName!,
      Key: filename,
      ContentType: input,
    });

    return {
      url: await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      }),
      file: `https://s3.${settings.s3Region}.amazonaws.com/${settings.s3BucketName}/${filename}`,
    };
  });
