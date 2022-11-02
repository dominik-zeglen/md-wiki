import { APIGatewayEvent, ALBResult } from "aws-lambda";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export function handler(
  cb: (
    data: APIGatewayEvent
  ) => Promise<Record<string, any> | Record<string, any>[]>
): (event: APIGatewayEvent) => Promise<ALBResult> {
  return async (event) => {
    try {
      const response = await cb(event);

      return {
        headers,
        statusCode: 200,
        body: JSON.stringify(response),
      };
    } catch (err: any) {
      return {
        headers,
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  };
}
