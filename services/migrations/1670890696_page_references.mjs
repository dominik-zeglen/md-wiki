import { sql, Kysely } from "kysely";

export async function up(db) {
  await db.schema
    .createTable("page_references")
    .addColumn("referenced_by", "varchar(255)", (col) => col.notNull())
    .addForeignKeyConstraint(
      "page_references_referenced_by",
      ["referenced_by"],
      "pages",
      ["slug"],
      (cb) => cb.onDelete("cascade")
    )
    .addColumn("references", "varchar(255)", (col) => col.notNull())
    .addForeignKeyConstraint(
      "page_references_references",
      ["references"],
      "pages",
      ["slug"],
      (cb) => cb.onDelete("cascade")
    )
    .addPrimaryKeyConstraint("primary_key", ["referenced_by", "references"])
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("page_references").execute();
}
