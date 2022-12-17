import type { Selectable } from "kysely";
import { db, getLastInsertId } from "./db";
import type { Database, MdWikiTags } from "./types";

export function getTag(
  id: string
): Promise<Selectable<MdWikiTags> | undefined> {
  return db
    .selectFrom("mdWiki.tags")
    .selectAll()
    .where("mdWiki.tags.id", "=", id)
    .executeTakeFirstOrThrow();
}

export function statTag(id: string) {
  return db
    .selectFrom("mdWiki.tags")
    .select([])
    .where("mdWiki.tags.id", "=", id)
    .executeTakeFirst();
}

export function getTags() {
  return db.selectFrom("mdWiki.tags").selectAll().execute();
}

export type UpdateTagInput = {
  id: string;
  data: Pick<Database["mdWiki.tags"], "name">;
  user: string;
};
export async function updateTag(input: UpdateTagInput) {
  const result = await db
    .updateTable("mdWiki.tags")
    .set({ ...input.data, updatedAt: new Date(), updatedBy: input.user })
    .where("mdWiki.tags.id", "=", input.id)
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new Error(`Tag #${input.id} not found`);
  }

  return { success: true };
}

export type CreateTagInput = {
  data: Pick<Database["mdWiki.tags"], "name">;
  user: string;
};
export async function createTag(input: CreateTagInput) {
  await db
    .insertInto("mdWiki.tags")
    .values({
      ...input.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: input.user,
      updatedBy: input.user,
    })
    .execute();

  const lastInsertId = await getLastInsertId();

  return (await getTag(lastInsertId))!;
}

export function getPagesWithTag(tagId: string) {
  return db
    .selectFrom("mdWiki.m2m_tags_pages")
    .where("tag", "=", tagId)
    .innerJoin(
      "mdWiki.pages",
      "mdWiki.m2m_tags_pages.page",
      "mdWiki.pages.slug"
    )
    .selectAll()
    .execute();
}

export function attachTagToPage(tagId: string, pageSlug: string) {
  return db
    .insertInto("mdWiki.m2m_tags_pages")
    .values({ page: pageSlug, tag: tagId })
    .execute();
}
export function unattachTagFromPage(tagId: string, pageSlug: string) {
  return db
    .deleteFrom("mdWiki.m2m_tags_pages")
    .where("mdWiki.m2m_tags_pages.page", "=", pageSlug)
    .where("mdWiki.m2m_tags_pages.tag", "=", tagId)
    .execute();
}

export function deleteTag(id: string) {
  return db.deleteFrom("mdWiki.tags").where("id", "=", id).execute();
}
