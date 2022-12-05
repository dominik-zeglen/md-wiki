export function dbDateToDateObject(date: string): Date {
  return new Date(date.replace(" ", "T"));
}
