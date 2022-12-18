import { sql, Kysely } from "kysely";

export async function up(db) {
  await db.schema
    .alterTable("users")
    .renameColumn("email", "username")
    .execute();
  await db
    .updateTable("users")
    .set({ username: "admin" })
    .where("username", "=", "admin@example.com")
    .execute();
  await db
    .updateTable("pages")
    .set({ createdBy: "admin" })
    .where("createdBy", "=", "admin@example.com")
    .execute();
  await db
    .updateTable("pages")
    .set({ updatedBy: "admin" })
    .where("updatedBy", "=", "admin@example.com")
    .execute();
  await db
    .updateTable("tags")
    .set({ createdBy: "admin" })
    .where("createdBy", "=", "admin@example.com")
    .execute();
  await db
    .updateTable("tags")
    .set({ updatedBy: "admin" })
    .where("updatedBy", "=", "admin@example.com")
    .execute();
}

export async function down(db) {
  await db.schema
    .alterTable("users")
    .renameColumn("username", "email")
    .execute();
}
