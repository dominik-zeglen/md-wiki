import type { Selectable } from "kysely";
import { db, getLastInsertId } from "./db";
import type { DB, Tags } from "./types";

export function getTag(id: string): Promise<Selectable<Tags> | undefined> {
  return db
    .selectFrom("tags")
    .selectAll()
    .where("tags.id", "=", parseInt(id))
    .executeTakeFirstOrThrow();
}

export function statTag(id: string) {
  return db
    .selectFrom("tags")
    .select([])
    .where("tags.id", "=", parseInt(id))
    .executeTakeFirst();
}

export function getTags() {
  return db.selectFrom("tags").selectAll().execute();
}

export type UpdateTagInput = {
  id: string;
  data: Pick<DB["tags"], "name">;
  user: string;
};
export async function updateTag(input: UpdateTagInput) {
  const result = await db
    .updateTable("tags")
    .set({ ...input.data, updatedAt: new Date(), updatedBy: input.user })
    .where("tags.id", "=", parseInt(input.id))
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new Error(`Tag #${input.id} not found`);
  }

  return { success: true };
}

export type CreateTagInput = {
  data: Pick<DB["tags"], "name">;
  user: string;
};
export async function createTag(input: CreateTagInput) {
  await db
    .insertInto("tags")
    .values({
      ...input.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: input.user,
      updatedBy: input.user,
    })
    .execute();

  const lastInsertId = await getLastInsertId();

  return getTag(lastInsertId)!;
}

export function getPagesWithTag(tagId: string) {
  return db
    .selectFrom("m2m_tags_pages")
    .where("tag", "=", parseInt(tagId))
    .innerJoin("pages", "m2m_tags_pages.page", "pages.slug")
    .selectAll()
    .execute();
}

export function attachTagToPage(tagId: string, pageSlug: string) {
  return db
    .insertInto("m2m_tags_pages")
    .values({ page: pageSlug, tag: parseInt(tagId) })
    .execute();
}
export function unattachTagFromPage(tagId: string, pageSlug: string) {
  return db
    .deleteFrom("m2m_tags_pages")
    .where("m2m_tags_pages.page", "=", pageSlug)
    .where("m2m_tags_pages.tag", "=", parseInt(tagId))
    .execute();
}

export function deleteTag(id: string) {
  return db.deleteFrom("tags").where("id", "=", parseInt(id)).execute();
}
