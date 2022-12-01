import { handler } from "../../utils/handler";
import { unattachTagFromPage } from "../../repository/tag";
import { markPageAsUpdated } from "../../repository/page";

export interface UnattachTagFromPageRequest {
  page: string;
}

export const main = handler(async (event) => {
  const { page }: UnattachTagFromPageRequest = JSON.parse(event.body!);
  const id = event.pathParameters!.id!;
  const user = event.requestContext.authorizer!.iam.cognitoIdentity.identityId;

  try {
    Promise.all([
      markPageAsUpdated({ slug: page, user }),
      unattachTagFromPage(id, page),
    ]);
  } catch (err) {
    throw err;
  }

  return { ok: true };
});
