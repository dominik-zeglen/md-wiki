import { Kysely } from "kysely";

export async function up(db) {
  await db.schema
    .createTable("tags")
    .addColumn("slug", "varchar(255)", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .addColumn("createdBy", "varchar(255)")
    .addColumn("updatedBy", "varchar(255)")
    .execute();

  await db.schema
    .createTable("m2m_tags_pages")
    .addColumn("tag", "varchar(255)", (col) => col.notNull())
    .addForeignKeyConstraint(
      "m2m_tags_pages_tag",
      ["tag"],
      "tags",
      ["slug"],
      (cb) => cb.onDelete("cascade")
    )
    .addColumn("page", "varchar(255)", (col) => col.notNull())
    .addForeignKeyConstraint(
      "m2m_tags_pages_page",
      ["page"],
      "pages",
      ["slug"],
      (cb) => cb.onDelete("cascade")
    )
    .addPrimaryKeyConstraint("primary_key", ["tag", "page"])
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("tags").execute();
  await db.schema.dropTable("m2m_tags_pages").execute();
}
