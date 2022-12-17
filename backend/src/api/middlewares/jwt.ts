import { middleware } from "../trpc";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";

export interface ClaimVerifyResult {
  readonly username: string;
}

interface Claim {
  auth_time: number;
  exp: number;
  username: string;
}

const verifyPromised = (token: string, secret: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, result) =>
      err ? reject(err) : resolve(result)
    );
  });

export const isValid = async (token: string): Promise<ClaimVerifyResult> => {
  const tokenSections = token.split(".");
  if (tokenSections.length < 2) {
    throw new Error("requested token is invalid");
  }
  const claim = (await verifyPromised(
    token,
    process.env.SECRET!
  )) as unknown as Claim;

  const currentSeconds = Math.floor(new Date().valueOf() / 1000);
  if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
    throw new Error("claim is expired or invalid");
  }

  return {
    username: claim.username,
  };
};

const unauthorizedError = new TRPCError({
  code: "UNAUTHORIZED",
});

export const jwtMiddleware = middleware(async (data) => {
  let user: ClaimVerifyResult;
  try {
    user = await isValid(data.ctx.request.headers.authorization!.substr(7));
  } catch (err) {
    throw unauthorizedError;
  }

  return data.next({
    ctx: {
      user,
    },
  });
});
