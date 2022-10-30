import AWS from "aws-sdk";
import { handler } from "../utils/handler";
import * as yup from "yup";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const schema = yup.object({
  slug: yup
    .string()
    .min(3)
    .required()
    .test("page-exist", "page ${slug} already exist", async (slug) => {
      const page = await dynamoDb
        .get({ TableName: process.env.TABLE_NAME!, Key: { slug } })
        .promise();

      return !page.Item;
    }),
  title: yup.string().min(3).required(),
  content: yup.string().required(),
});

export const main = handler(async (event) => {
  const currentDate = new Date().toISOString();
  const data = JSON.parse(event.body!);
  const user = event.requestContext.authorizer!.iam.cognitoIdentity.identityId;

  const isValid = await schema.isValid(data);
  if (!isValid) {
    const errors = await schema.validate(data);

    return { errors };
  }

  const params = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      createdAt: currentDate,
      updatedAt: currentDate,
      createdBy: user,
      updatedBy: user,

      title: data.title,
      slug: data.slug,
      content: data.content,
    },
  };

  await dynamoDb.put(params).promise();

  return params.Item;
});
