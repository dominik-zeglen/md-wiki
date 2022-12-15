import { sql, Kysely } from "kysely";
import bcrypt from "bcryptjs";

export async function up(db) {
  await db.schema.alterTable("users").dropColumn("cognitoUserName").execute();
  await db.schema
    .alterTable("users")
    .addColumn("hash", "varchar(255)", (db) => db.notNull())
    .execute();

  await db
    .insertInto("mdWiki.users")
    .values({
      email: "admin@example.com",
      hash: await bcrypt.hash("admin", 10),
    })
    .execute();
}

export async function down(db) {
  await db.schema.alterTable("users").dropColumn("hash").execute();
  await db.schema
    .alterTable("users")
    .addColumn("cognitoUserName", "varchar(255)", (col) =>
      col.notNull().unique()
    );
}
