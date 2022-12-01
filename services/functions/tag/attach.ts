import { handler } from "../../utils/handler";
import { attachTagToPage } from "../../repository/tag";
import { markPageAsUpdated } from "../../repository/page";

export interface AttachTagToPageRequest {
  page: string;
}

export const main = handler(async (event) => {
  const { page }: AttachTagToPageRequest = JSON.parse(event.body!);
  const id = event.pathParameters!.id!;
  const user = event.requestContext.authorizer!.iam.cognitoIdentity.identityId;

  try {
    Promise.all([
      markPageAsUpdated({ slug: page, user }),
      attachTagToPage(id, page),
    ]);
  } catch (err) {
    throw err;
  }

  return { ok: true };
});
