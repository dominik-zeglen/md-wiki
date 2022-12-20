import { SelectQueryBuilder } from "kysely";

export interface PaginationInput {
  page: number;
  size: number;
}

export async function paginate<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  { page, size }: PaginationInput
) {
  if (page < 1) {
    throw new Error("Page out of bounds");
  }

  const q = query.limit(size + 1).offset((page - 1) * size);

  const results = await q.execute();
  const hasNext = results.length > size;

  return {
    results:
      results.length > size ? results.slice(0, results.length - 1) : results,
    hasNext,
    hasPrevious: page > 1,
  };
}
