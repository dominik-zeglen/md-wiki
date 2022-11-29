import type { SelectType } from "kysely";
import type { Timestamp } from "../../../services/repository/db.d";

export function dbDateToDateObject(date: SelectType<Timestamp>) {
  return new Date((date as any as string).replace(" ", "T"));
}
