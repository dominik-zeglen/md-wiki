import type { Timestamp } from "../../../services/repository/db.d";

export function dbDateToDateObject(date: Timestamp) {
  return new Date((date as any as string).replace(" ", "T"));
}
