import { db } from "./db";
import { Database } from "./db.d";

export function getPage(slug: string) {
  return db
    .selectFrom("pages")
    .selectAll()
    .where("pages.slug", "=", slug)
    .executeTakeFirst();
}

export function statPage(slug: string) {
  return db
    .selectFrom("pages")
    .select([])
    .where("pages.slug", "=", slug)
    .executeTakeFirst();
}

export function getPages() {
  return db.selectFrom("pages").selectAll().execute();
}

export type UpdatePageInput = {
  slug: string;
  data: Pick<Database["pages"], "content" | "title">;
  user: string;
};
export async function updatePage(input: UpdatePageInput) {
  const result = await db
    .updateTable("pages")
    .set({ ...input.data, updatedAt: new Date(), updatedBy: input.user })
    .where("pages.slug", "=", input.slug)
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new Error(`Page ${input.slug} not found`);
  }

  return { success: true };
}

export type CreatePageInput = {
  data: Pick<Database["pages"], "slug" | "content" | "title">;
  user: string;
};
export async function createPage(input: CreatePageInput) {
  await db
    .insertInto("pages")
    .values({
      ...input.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: input.user,
      updatedBy: input.user,
    })
    .executeTakeFirst();

  return (await getPage(input.data.slug))!;
}
