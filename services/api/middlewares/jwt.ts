import { middleware } from "../trpc";
import { TRPCError } from "@trpc/server";
import { verify } from "jsonwebtoken";

export interface ClaimVerifyResult {
  readonly email: string;
}

interface Claim {
  auth_time: number;
  exp: number;
  email: string;
}

const verifyPromised = (token: string, secret: string) =>
  new Promise((resolve, reject) => {
    verify(token, secret, (err, result) =>
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
  console.log(claim);
  const currentSeconds = Math.floor(new Date().valueOf() / 1000);
  if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
    throw new Error("claim is expired or invalid");
  }

  return {
    email: claim.email,
  };
};

const unauthorizedError = new TRPCError({
  code: "UNAUTHORIZED",
});

export const jwtMiddleware = middleware(async (data) => {
  try {
    data.ctx.user = await isValid(
      data.ctx.event.headers.authorization!.substr(7)
    );
  } catch (err) {
    throw unauthorizedError;
  }

  return data.next();
});
