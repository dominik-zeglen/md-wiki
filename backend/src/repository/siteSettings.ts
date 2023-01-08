import { db } from "./db";

export function getSiteSettings() {
  return db
    .selectFrom("site_settings")
    .select(["name"])
    .executeTakeFirstOrThrow();
}

export function getS3Settings() {
  return db
    .selectFrom("site_settings")
    .select(["s3BucketName", "s3AccessKeyId", "s3SecretAccessKey", "s3Region"])
    .executeTakeFirstOrThrow();
}

export type UpdateSiteSettingsInput = {
  name: string;
};
export async function updateSiteSettings(input: UpdateSiteSettingsInput) {
  return db
    .updateTable("site_settings")
    .set({
      name: input.name,
    })
    .execute();
}

export type UpdateS3SettingsInput = {
  s3BucketName: string;
  s3AccessKeyId: string;
  s3SecretAccessKey: string;
  s3Region: string;
};
export async function updateS3Settings(input: UpdateS3SettingsInput) {
  return db.updateTable("site_settings").set(input).execute();
}

export async function deleteS3Settings() {
  return db
    .updateTable("site_settings")
    .set({
      s3AccessKeyId: null,
      s3BucketName: null,
      s3Region: null,
      s3SecretAccessKey: null,
    })
    .execute();
}
