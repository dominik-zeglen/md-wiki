import { db } from "../repository/db";
import { PostAuthenticationTriggerEvent } from "aws-lambda";

export const main = async (
  request: PostAuthenticationTriggerEvent,
  _: any,
  cb: any
) => {
  try {
    await db
      .selectFrom("mdWiki.users")
      .select([])
      .where("cognitoUserName", "=", request.userName)
      .executeTakeFirstOrThrow();
  } catch {
    await db
      .insertInto("mdWiki.users")
      .values({
        cognitoUserName: request.userName,
        email: request.request.userAttributes.email,
      })
      .execute();
  } finally {
    cb(null, request);
  }
};
