---
to: backend/migrations/<%=(Date.now()/1000).toFixed(0)%>_<%=name%>.mjs
---
import { sql, Kysely } from "kysely";

export async function up(db) {
  await sql`ALTER TABLE tags MODIFY name TEXT CHARACTER SET utf8mb4;`.execute(
    db
  );
    await db.schema
    .createTable("tags")
    .addColumn("id", "bigint", (col) =>
      col.notNull().autoIncrement().primaryKey()
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .addColumn("createdBy", "varchar(255)")
    .addColumn("updatedBy", "varchar(255)")
    .execute();
}

export async function down(db) {
  await sql`ALTER TABLE tags MODIFY name TEXT CHARACTER SET latin1;`.execute(
    db
  );
  await db.schema.dropTable("tags").execute();
}
