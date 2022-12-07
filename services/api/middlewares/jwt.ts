import { middleware } from "../trpc";
import { TRPCError } from "@trpc/server";
import * as jsonwebtoken from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import { promisify } from "util";
import axios from "axios";

export interface ClaimVerifyResult {
  readonly userName: string;
  readonly clientId: string;
}

interface TokenHeader {
  kid: string;
  alg: string;
}
interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

interface PublicKeys {
  keys: PublicKey[];
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

interface Claim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}

const cognitoPoolId = process.env.COGNITO_POOL_ID || "";
if (!cognitoPoolId) {
  throw new Error("env var required for cognito pool");
}
const cognitoIssuer = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${cognitoPoolId}`;

let cacheKeys: MapOfKidToPublicKey | undefined;
const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
  if (!cacheKeys) {
    const url = `${cognitoIssuer}/.well-known/jwks.json`;
    const publicKeys = await axios.get<PublicKeys>(url);
    cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
      const pem = jwkToPem(current as any);
      agg[current.kid] = { instance: current, pem };
      return agg;
    }, {} as MapOfKidToPublicKey);

    return cacheKeys;
  } else {
    return cacheKeys;
  }
};

const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

export const isValid = async (token: string): Promise<ClaimVerifyResult> => {
  const tokenSections = token.split(".");
  if (tokenSections.length < 2) {
    throw new Error("requested token is invalid");
  }
  const headerJSON = Buffer.from(tokenSections[0], "base64").toString("utf8");
  const header = JSON.parse(headerJSON) as TokenHeader;
  const keys = await getPublicKeys();
  const key = keys[header.kid];
  if (key === undefined) {
    throw new Error("claim made for unknown kid");
  }
  const claim = (await verifyPromised(token, key.pem)) as Claim;
  const currentSeconds = Math.floor(new Date().valueOf() / 1000);
  if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
    throw new Error("claim is expired or invalid");
  }
  if (claim.iss !== cognitoIssuer) {
    throw new Error("claim issuer is invalid");
  }
  if (claim.token_use !== "access") {
    throw new Error("claim use is not access");
  }

  return {
    userName: claim.username,
    clientId: claim.client_id,
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
