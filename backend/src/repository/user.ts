import { db, getLastInsertId } from "./db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { hash, compare } = bcrypt;

function hashPassword(password: string) {
  return hash(password, 10);
}

export function getUser(username: string) {
  return db
    .selectFrom("mdWiki.users")
    .select(["username", "displayName"])
    .where("mdWiki.users.username", "=", username)
    .executeTakeFirstOrThrow();
}

export function getUsers() {
  return db
    .selectFrom("mdWiki.users")
    .select(["username", "displayName"])
    .execute();
}

export type CreateUserInput = {
  username: string;
  password: string;
  displayName?: string;
};
export async function createUser(input: CreateUserInput) {
  await db
    .insertInto("mdWiki.users")
    .values({
      displayName: input.displayName,
      username: input.username,
      hash: await hashPassword(input.password),
    })
    .execute();

  return getLastInsertId();
}

export type UpdateUserInput = {
  data: { password?: string; displayName?: string };
  user: string;
};
export async function updateUser(input: UpdateUserInput) {
  await db
    .updateTable("mdWiki.users")
    .set({
      displayName: input.data.displayName,
      hash: input.data.password
        ? await hashPassword(input.data.password)
        : undefined,
    })
    .where("username", "=", input.user)
    .execute();

  return true;
}

export function getUserToken(username: string, expires: number | null): string {
  return jwt.sign(
    { username },
    process.env.SECRET!,
    expires
      ? ({
          expiresIn: expires,
        } as jwt.SignOptions)
      : {}
  );
}

export function verifyUserToken(token: string): boolean {
  return true;
}

export async function verifyUser(username: string, password: string) {
  const user = await db
    .selectFrom("mdWiki.users")
    .select(["username", "hash"])
    .where("mdWiki.users.username", "=", username)
    .executeTakeFirstOrThrow();

  return compare(password, user.hash);
}

export function deleteUser(username: string) {
  return db
    .deleteFrom("mdWiki.users")
    .where("username", "=", username)
    .execute();
}
