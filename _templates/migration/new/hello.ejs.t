---
to: backend/migrations/src/<%=(Date.now()/1000).toFixed(0)%>_<%=name%>.ts
---
import type { Kysely } from "kysely";
import type { DB } from "../../src/repository/types";

export async function up(db: Kysely<DB>) {
  await db.schema
    .alterTable("pages")
    .addColumn("highlighted", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .execute();
}

export async function down(db: Kysely<DB>) {
  await db.schema.alterTable("pages").dropColumn("highlighted").execute();
}
