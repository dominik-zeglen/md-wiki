import AWS from "aws-sdk";
import { handler } from "../utils/handler";
import * as yup from "yup";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function checkIfPageExists(slug: string): Promise<void> {
  const page = await dynamoDb
    .get({ TableName: process.env.TABLE_NAME!, Key: { slug } })
    .promise();

  if (!page.Item) {
    throw new Error(`Page ${slug} does not exist`);
  }
}

export const main = handler(async (event) => {
  const currentDate = new Date().toISOString();
  const data = JSON.parse(event.body!);
  const slug = event.pathParameters!.slug;
  const user = event.requestContext.authorizer!.iam.cognitoIdentity.identityId;

  const schema = yup.object({
    title: yup.string().min(3).required(),
    content: yup.string().required(),
  });

  checkIfPageExists(slug!);

  const isValid = await schema.isValid(data);
  if (!isValid) {
    const errors = await schema.validate(data);

    return { errors };
  }

  const params: DocumentClient.UpdateItemInput = {
    Key: { slug },
    TableName: process.env.TABLE_NAME!,
    UpdateExpression: `SET ${["updatedAt", "updatedBy", "title", "content"]
      .map((field) => `${field} = :${field}`)
      .join(", ")}`,
    ExpressionAttributeValues: {
      ":updatedAt": currentDate,
      ":updatedBy": user,

      ":title": data.title,
      ":content": data.content,
    },
  };

  await dynamoDb.update(params).promise();

  return { ok: true };
});
