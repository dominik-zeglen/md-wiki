import AWS from "aws-sdk";
import type { APIGatewayEvent } from "aws-lambda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function checkIfPageExists(slug: string): Promise<void> {
  const page = await dynamoDb
    .get({ TableName: process.env.TABLE_NAME!, Key: { slug } })
    .promise();

  if (page) {
    throw new Error(`Page ${slug} already exists`);
  }
}

export async function main(event: APIGatewayEvent) {
  const data = JSON.parse(event.body!);
  const currentDate = new Date().toISOString();

  await checkIfPageExists(data.slug);

  const params = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      createdAt: currentDate,
      updatedAt: currentDate,
      createdBy: "admin@example.com",
      updatedBy: "admin@example.com",

      slug: data.slug,
      content: data.content,
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
