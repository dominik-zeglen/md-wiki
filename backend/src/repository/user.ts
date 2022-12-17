import { db, getLastInsertId } from "./db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { hash, compare } = bcrypt;

function hashPassword(password: string) {
  return hash(password, 10);
}

export function getUser(email: string) {
  return db
    .selectFrom("mdWiki.users")
    .select(["email", "displayName"])
    .where("mdWiki.users.email", "=", email)
    .executeTakeFirstOrThrow();
}

export function getUsers() {
  return db
    .selectFrom("mdWiki.users")
    .select(["email", "displayName"])
    .execute();
}

export type CreateUserInput = {
  email: string;
  password: string;
  displayName?: string;
};
export async function createUser(input: CreateUserInput) {
  await db
    .insertInto("mdWiki.users")
    .values({
      displayName: input.displayName,
      email: input.email,
      hash: await hashPassword(input.password),
    })
    .execute();

  return getLastInsertId();
}

export type UpdateUserInput = {
  data: { password?: string; displayName?: string };
  email: string;
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
    .where("email", "=", input.email)
    .execute();

  return true;
}

export function getUserToken(email: string): string {
  return jwt.sign({ email }, process.env.SECRET!);
}

export function verifyUserToken(token: string): boolean {
  return true;
}

export async function verifyUser(email: string, password: string) {
  const user = await db
    .selectFrom("mdWiki.users")
    .select(["email", "hash"])
    .where("mdWiki.users.email", "=", email)
    .executeTakeFirstOrThrow();

  return compare(password, user.hash);
}

export function deleteUser(email: string) {
  return db.deleteFrom("mdWiki.users").where("email", "=", email).execute();
}
