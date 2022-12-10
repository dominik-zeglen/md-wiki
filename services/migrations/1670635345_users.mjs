import { Kysely } from "kysely";

export async function up(db) {
  await db.schema
    .createTable("users")
    .addColumn("email", "varchar(255)", (col) => col.notNull().primaryKey())
    .addColumn("displayName", "varchar(255)")
    .addColumn("cognitoUserName", "varchar(255)", (col) =>
      col.notNull().unique()
    )
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("users").execute();
}
