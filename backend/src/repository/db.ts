import { Kysely, sql, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "./types";

export const db = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT!),
      enableKeepAlive: true,
    }),
  }),
});

export const getLastInsertId = async () =>
  ((await sql`SELECT LAST_INSERT_ID();`.execute(db)) as any).rows[0][
    "LAST_INSERT_ID()"
  ];
