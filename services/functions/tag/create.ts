import { handler } from "../../utils/handler";
import * as yup from "yup";
import { createTag, CreateTagInput } from "repository/tag";

const schema = yup.object({
  name: yup.string().min(3).required(),
});

export const main = handler(async (event) => {
  const data: CreateTagInput = JSON.parse(event.body!);
  const user = event.requestContext.authorizer!.iam.cognitoIdentity.identityId;

  const isValid = await schema.isValid(data.data);
  if (!isValid) {
    const errors = await schema.validate(data.data);

    return { errors };
  }

  return createTag({ ...data, user });
});
