import AWS from "aws-sdk";
import { handler } from "../utils/handler";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = handler(async (event) => {
  const slug = event.pathParameters!.slug;

  await dynamoDb
    .delete({ TableName: process.env.TABLE_NAME!, Key: { slug } })
    .promise();

  return { ok: true };
});
