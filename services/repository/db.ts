import { RDSDataService } from "aws-sdk";
import { Kysely, sql } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { Database } from "./db.d";

export const db = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "mysql",
    driver: {
      database: process.env.DATABASE_NAME!,
      secretArn: process.env.SECRET_ARN!,
      resourceArn: process.env.CLUSTER_ARN!,
      client: new RDSDataService(),
    },
    // Version mismatch between kysely@0.22.0 and 0.21.6 for unknown reasons
  }) as any,
});

export const getLastInsertId = async () =>
  ((await sql`SELECT LAST_INSERT_ID();`.execute(db)) as any).rows[0][
    "LAST_INSERT_ID()"
  ];
