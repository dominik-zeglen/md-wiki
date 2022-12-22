import { omit, pipe, toArray, uniq } from "@fxts/core";
import { remark } from "remark";
import directivePlugin from "remark-directive";
import { visit } from "unist-util-visit";

import { db } from "./db";
import { DB } from "./types";
import { sql } from "kysely";
import { PaginationInput, paginate } from "./utils";

const getPagesWithUserQuery = db
  .selectFrom("pages")
  .leftJoin(
    db.selectFrom("users").selectAll().as("createdBy"),
    "createdBy.username",
    "pages.createdBy"
  )
  .leftJoin(
    db.selectFrom("users").selectAll().as("updatedBy"),
    "updatedBy.username",
    "pages.updatedBy"
  )
  .select([
    "createdBy.displayName as createdByDisplayName",
    "createdBy.username as createdByUsername",
    "updatedBy.displayName as updatedByDisplayName",
    "updatedBy.username as updatedByUsername",
    "createdAt",
    "updatedAt",
  ]);

function withPageUsers<
  T extends Awaited<ReturnType<typeof getPagesWithUserQuery["execute"]>>[number]
>(page: T) {
  return {
    ...omit(
      [
        "createdByDisplayName",
        "createdByUsername",
        "updatedByDisplayName",
        "updatedByUsername",
      ],
      page
    ),
    created: {
      user: {
        displayName: page.createdByDisplayName,
        username: page.createdByUsername,
      },
      date: page.createdAt,
    },
    updated: {
      user: {
        displayName: page.updatedByDisplayName,
        username: page.updatedByUsername,
      },
      date: page.updatedAt,
    },
  };
}

function pageReferencePlugin(cb: (slug: string) => void) {
  return () => (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name !== "page") return;

        const attributes = node.attributes || {};
        const slug = attributes.id;

        if (!slug) return;

        cb(slug);
      }
    });
  };
}

export async function getPage(slug: string) {
  const [page, tags] = await Promise.all([
    getPagesWithUserQuery
      .where("pages.slug", "=", slug)
      .select(["content", "slug", "title"])
      .executeTakeFirstOrThrow(),
    db
      .selectFrom("m2m_tags_pages")
      .where("page", "=", slug)
      .innerJoin("tags", "m2m_tags_pages.tag", "tags.id")
      .select(["id", "name"])
      .execute(),
  ]);

  return withPageUsers({ ...page, tags: tags ?? [] });
}

export function statPage(slug: string) {
  return db
    .selectFrom("pages")
    .select(["slug"])
    .where("pages.slug", "=", slug)
    .executeTakeFirst();
}

export interface PageOrder {
  by: "createdAt" | "updatedAt" | "title";
  ascending: boolean;
}
export interface PageFilters {
  title?: string | null;
}

export async function getPages(
  pagination: PaginationInput,
  order: PageOrder | null = null,
  { title }: PageFilters = {}
) {
  let q = getPagesWithUserQuery.select(["slug", "title", "highlighted"]);

  if (order) {
    q = q.orderBy(order.by, order.ascending ? "asc" : "desc");
  }

  if (title) {
    q = q.where("title", "like", `%${title}%`);
  }

  const paginated = await paginate(q, pagination);

  return {
    ...paginated,
    results: paginated.results.map(withPageUsers),
  };
}

export type MarkPageAsUpdatedInput = {
  slug: string;
  user: string;
};
export async function markPageAsUpdated(input: MarkPageAsUpdatedInput) {
  const result = await db
    .updateTable("pages")
    .set({ updatedAt: new Date(), updatedBy: input.user })
    .where("pages.slug", "=", input.slug)
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new Error(`Page ${input.slug} not found`);
  }

  return { success: true };
}

export type UpdatePageInput = {
  slug: string;
  data: Pick<DB["pages"], "content" | "title">;
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

  await updateReferences(
    input.slug,
    getPageReferencesFromContent(input.data.content)
  );

  return { success: true };
}

export type CreatePageInput = {
  data: Pick<DB["pages"], "slug" | "content" | "title">;
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

  await updateReferences(
    input.data.slug,
    getPageReferencesFromContent(input.data.content)
  );

  return (await getPage(input.data.slug))!;
}

export function deletePage(slug: string) {
  return db.deleteFrom("pages").where("slug", "=", slug).execute();
}

export function searchPage(text: string) {
  return db
    .selectFrom("pages")
    .select(["slug", "title", sql<string>`substr(content, 1, 100)`.as("brief")])
    .where("title", "like", `%${text}%`)
    .limit(5)
    .execute();
}

export function getPageReferences(slug: string) {
  return db
    .selectFrom("page_references")
    .selectAll()
    .where("references", "=", slug)
    .innerJoin("pages", "pages.slug", "page_references.referenced_by")
    .select(["slug", "title"])
    .execute();
}

export function getPageReferencesFromContent(content: string) {
  let slugs: string[] = [];

  remark()
    .use([directivePlugin, pageReferencePlugin((slug) => slugs.push(slug))])
    .processSync(content);

  return pipe(slugs, uniq, toArray);
}

export function updateReferences(referencedBy: string, references: string[]) {
  return Promise.all(
    references.map((page) =>
      db
        .insertInto("page_references")
        .ignore()
        .values({ referenced_by: referencedBy, references: page })
        .execute()
    )
  );
}

export function setPageHighlight(slug: string, highlighted: boolean) {
  return db
    .updateTable("pages")
    .where("slug", "=", slug)
    .set({ highlighted: highlighted ? 1 : 0 })
    .execute();
}
