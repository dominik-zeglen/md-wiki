import { sql, Kysely } from "kysely";

export async function up(db) {
  await sql`ALTER TABLE pages MODIFY title VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL`.execute(
    db
  );
  await sql`ALTER TABLE pages MODIFY content TEXT CHARACTER SET utf8mb4 NOT NULL`.execute(
    db
  );
}

export async function down(db) {
  await sql`ALTER TABLE pages MODIFY title TEXT CHARACTER SET utf8mb4;`.execute(
    db
  );
  await sql`ALTER TABLE pages MODIFY content TEXT CHARACTER SET utf8mb4`.execute(
    db
  );
}
