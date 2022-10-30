import AWS from "aws-sdk";
import { handler } from "../utils/handler";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = handler(async (event) => {
  const slug = event.pathParameters!.slug;

  const { Item: page } = await dynamoDb
    .get({ TableName: process.env.TABLE_NAME!, Key: { slug } })
    .promise();

  if (!page) {
    throw new Error(`Page ${slug} does not exist`);
  }

  return page;
});
