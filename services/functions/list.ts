import AWS from "aws-sdk";
import { handler } from "../utils/handler";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = handler(async () => {
  const { Items: pages } = await dynamoDb
    .scan({ TableName: process.env.TABLE_NAME! })
    .promise();

  return pages!;
});
