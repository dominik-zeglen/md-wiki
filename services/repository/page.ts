import { db } from "./db";
import { Database } from "./db.d";

export async function getPage(slug: string) {
  const [page, tags] = await Promise.all([
    db
      .selectFrom("mdWiki.pages")
      .selectAll()
      .where("mdWiki.pages.slug", "=", slug)
      .executeTakeFirstOrThrow(),
    db
      .selectFrom("mdWiki.m2m_tags_pages")
      .where("page", "=", slug)
      .innerJoin("mdWiki.tags", "mdWiki.m2m_tags_pages.tag", "mdWiki.tags.id")
      .select(["id", "name"])
      .execute(),
  ]);

  return {
    ...page!,
    tags: tags ?? [],
  };
}

export function statPage(slug: string) {
  return db
    .selectFrom("mdWiki.pages")
    .select(["slug"])
    .where("mdWiki.pages.slug", "=", slug)
    .executeTakeFirst();
}

export function getPages() {
  return db
    .selectFrom("mdWiki.pages")
    .select([
      "createdAt",
      "createdBy",
      "slug",
      "title",
      "updatedAt",
      "updatedBy",
    ])
    .execute();
}

export type MarkPageAsUpdatedInput = {
  slug: string;
  user: string;
};
export async function markPageAsUpdated(input: MarkPageAsUpdatedInput) {
  const result = await db
    .updateTable("mdWiki.pages")
    .set({ updatedAt: new Date(), updatedBy: input.user })
    .where("mdWiki.pages.slug", "=", input.slug)
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new Error(`Page ${input.slug} not found`);
  }

  return { success: true };
}

export type UpdatePageInput = {
  slug: string;
  data: Pick<Database["mdWiki.pages"], "content" | "title">;
  user: string;
};
export async function updatePage(input: UpdatePageInput) {
  const result = await db
    .updateTable("mdWiki.pages")
    .set({ ...input.data, updatedAt: new Date(), updatedBy: input.user })
    .where("mdWiki.pages.slug", "=", input.slug)
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new Error(`Page ${input.slug} not found`);
  }

  return { success: true };
}

export type CreatePageInput = {
  data: Pick<Database["mdWiki.pages"], "slug" | "content" | "title">;
  user: string;
};
export async function createPage(input: CreatePageInput) {
  await db
    .insertInto("mdWiki.pages")
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

export function deletePage(slug: string) {
  return db.deleteFrom("mdWiki.pages").where("slug", "=", slug).execute();
}
