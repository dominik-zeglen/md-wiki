import { sql, Kysely } from "kysely";

export async function up(db) {
  await sql`ALTER TABLE tags MODIFY name TEXT CHARACTER SET utf8mb4;`.execute(
    db
  );
  await sql`ALTER TABLE pages MODIFY title TEXT CHARACTER SET utf8mb4;`.execute(
    db
  );
  await sql`ALTER TABLE pages MODIFY content TEXT CHARACTER SET utf8mb4;`.execute(
    db
  );
}

export async function down(db) {
  await sql`ALTER TABLE tags MODIFY name TEXT CHARACTER SET latin1;`.execute(
    db
  );
  await sql`ALTER TABLE pages MODIFY title TEXT CHARACTER SET latin1;`.execute(
    db
  );
  await sql`ALTER TABLE pages MODIFY content TEXT CHARACTER SET latin1;`.execute(
    db
  );
}
