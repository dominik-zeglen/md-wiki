import { handler } from "../utils/handler";
import * as yup from "yup";
import { updatePage, UpdatePageInput } from "repository/page";

export const main = handler(async (event) => {
  const { data }: UpdatePageInput = JSON.parse(event.body!);
  const slug = event.pathParameters!.slug!;
  const user = event.requestContext.authorizer!.iam.cognitoIdentity.identityId;

  const schema = yup.object({
    title: yup.string().min(3).required(),
    content: yup.string().required(),
  });

  const isValid = await schema.isValid(data);
  if (!isValid) {
    const errors = await schema.validate(data);

    return { errors };
  }

  await updatePage({
    data: data,
    slug,
    user,
  });

  return { ok: true };
});
