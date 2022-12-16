import { pick, pipe, toArray, uniq } from "@fxts/core";
import { remark } from "remark";
import directivePlugin from "remark-directive";
import { visit } from "unist-util-visit";

import { db } from "./db";
import { Database } from "./db.d";
import { sql } from "kysely";

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
    db
      .selectFrom("mdWiki.pages")
      .where("mdWiki.pages.slug", "=", slug)
      .leftJoin(
        db.selectFrom("mdWiki.users").selectAll().as("createdBy"),
        "createdBy.email",
        "mdWiki.pages.createdBy"
      )
      .leftJoin(
        db.selectFrom("mdWiki.users").selectAll().as("updatedBy"),
        "updatedBy.email",
        "mdWiki.pages.updatedBy"
      )
      .select([
        "createdBy.displayName as createdByDisplayName",
        "createdBy.email as createdByEmail",
        "updatedBy.displayName as updatedByDisplayName",
        "updatedBy.email as updatedByEmail",
        "content",
        "createdAt",
        "updatedAt",
        "slug",
        "title",
      ])
      .executeTakeFirstOrThrow(),
    db
      .selectFrom("mdWiki.m2m_tags_pages")
      .where("page", "=", slug)
      .innerJoin("mdWiki.tags", "mdWiki.m2m_tags_pages.tag", "mdWiki.tags.id")
      .select(["id", "name"])
      .execute(),
  ]);

  return {
    ...pick(["content", "createdAt", "updatedAt", "slug", "title"], page!),
    created: {
      user: {
        displayName: page.createdByDisplayName,
        email: page.createdByEmail,
      },
      date: page.createdAt,
    },
    updated: {
      user: {
        displayName: page.updatedByDisplayName,
        email: page.updatedByEmail,
      },
      date: page.updatedAt,
    },
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

  await updateReferences(
    input.slug,
    getPageReferencesFromContent(input.data.content)
  );

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

  await updateReferences(
    input.data.slug,
    getPageReferencesFromContent(input.data.content)
  );

  return (await getPage(input.data.slug))!;
}

export function deletePage(slug: string) {
  return db.deleteFrom("mdWiki.pages").where("slug", "=", slug).execute();
}

export function searchPage(text: string) {
  return db
    .selectFrom("mdWiki.pages")
    .select(["slug", "title", sql<string>`substr(content, 1, 200)`.as("brief")])
    .where("title", "like", `%${text}%`)
    .limit(5)
    .execute();
}

export function getPageReferences(slug: string) {
  return db
    .selectFrom("mdWiki.page_references")
    .selectAll()
    .where("references", "=", slug)
    .innerJoin(
      "mdWiki.pages",
      "mdWiki.pages.slug",
      "mdWiki.page_references.referenced_by"
    )
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
        .insertInto("mdWiki.page_references")
        .ignore()
        .values({ referenced_by: referencedBy, references: page })
        .execute()
    )
  );
}
