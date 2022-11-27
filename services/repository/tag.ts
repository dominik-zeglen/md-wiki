import { db, getLastInsertId } from "./db";
import { Database } from "./db.d";

export function getTag(id: string) {
  return db
    .selectFrom("mdWiki.tags")
    .selectAll()
    .where("mdWiki.tags.id", "=", id)
    .executeTakeFirst();
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
  const result = await db
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
