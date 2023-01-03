import { db } from "./db";

export function getSiteSettings() {
  return db
    .selectFrom("site_settings")
    .select(["name"])
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
