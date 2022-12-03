import { deleteTag } from "repository/tag";
import { handler } from "../../utils/handler";

export const main = handler(async (event) => {
  const id = event.pathParameters!.id!;

  await deleteTag(id);

  return { ok: true };
});
