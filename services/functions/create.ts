import { handler } from "../utils/handler";
import * as yup from "yup";
import { createPage, CreatePageInput, statPage } from "repository/page";

const schema = yup.object({
  slug: yup
    .string()
    .min(3)
    .required()
    .test("page-exist", "page ${slug} already exist", async (slug) => {
      const exists = await statPage(slug!);

      return !exists;
    }),
  title: yup.string().min(3).required(),
  content: yup.string().required(),
});

export const main = handler(async (event) => {
  const data: CreatePageInput = JSON.parse(event.body!);
  const user = event.requestContext.authorizer!.iam.cognitoIdentity.identityId;

  const isValid = await schema.isValid(data.data);
  if (!isValid) {
    const errors = await schema.validate(data.data);

    return { errors };
  }

  return createPage({ ...data, user });
});
