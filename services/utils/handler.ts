import { APIGatewayEvent, ALBResult } from "aws-lambda";

export function handler(
  cb: (data: APIGatewayEvent) => Promise<Record<string, any>>
): (event: APIGatewayEvent) => Promise<ALBResult> {
  return async (event) => {
    try {
      const response = await cb(event);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: err.message }),
      };
    }
  };
}
