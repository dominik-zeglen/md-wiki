import { Kysely } from "kysely";

export async function up(db) {
  await db.schema
    .createTable("pages")
    .addColumn("slug", "text", (col) => col.primaryKey())
    .addColumn("title", "text")
    .addColumn("content", "text")
    .addColumn("createdAt", "date")
    .addColumn("updatedAt", "date")
    .addColumn("createdBy", "varchar(255)")
    .addColumn("updatedBy", "varchar(255)")
    .execute();

  await db
    .insertInto("pages")
    .values({
      slug: "index",
      title: "Home Page",
      content:
        "Welcome to md-wiki! To begin editing log in and click on *edit* button",

      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
      updatedBy: null,
    })
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("pages").execute();
}
