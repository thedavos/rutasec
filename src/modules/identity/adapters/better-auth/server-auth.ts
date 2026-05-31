import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { getDb } from "#/shared/db";

function readAuthEnv() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not set");
  }

  return {
    secret,
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  };
}

function createAuthInstance() {
  const { secret, baseURL } = readAuthEnv();

  return betterAuth({
    database: getDb(),
    secret,
    baseURL,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [tanstackStartCookies()],
  });
}

type AuthInstance = ReturnType<typeof createAuthInstance>;

let authInstance: AuthInstance | undefined;

export function getAuth(): AuthInstance {
  authInstance ??= createAuthInstance();
  return authInstance;
}
