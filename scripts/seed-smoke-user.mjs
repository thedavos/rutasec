#!/usr/bin/env node
/**
 * Idempotent local smoke account for manual QA.
 * Requires dev server (npm run dev) and local D1 schema.
 *
 * Usage:
 *   node scripts/seed-smoke-user.mjs
 *   node scripts/seed-smoke-user.mjs --reset   # delete + recreate
 */

import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SMOKE = {
  email: "smoke@rutasec.local",
  password: "SmokeTest123!",
  name: "Smoke Tester",
};

const baseUrl =
  process.env.BETTER_AUTH_URL ?? process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const reset = process.argv.includes("--reset");

function wranglerSql(sql) {
  const escaped = sql.replace(/"/g, '\\"');
  execSync(`npx wrangler d1 execute rutasec-db --local --command "${escaped}"`, {
    cwd: root,
    stdio: "inherit",
  });
}

async function authFetch(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: baseUrl,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: response.ok, status: response.status, json };
}

async function findAuthUserId() {
  const sql = `SELECT id FROM user WHERE email = '${SMOKE.email}';`;
  const out = execSync(`npx wrangler d1 execute rutasec-db --local --command "${sql}" --json`, {
    cwd: root,
    encoding: "utf8",
  });
  const parsed = JSON.parse(out);
  const row = parsed?.[0]?.results?.[0];
  return row?.id ?? null;
}

function deleteSmokeUser(authUserId) {
  wranglerSql(`DELETE FROM session WHERE userId = '${authUserId}';`);
  wranglerSql(`DELETE FROM account WHERE userId = '${authUserId}';`);
  wranglerSql(
    `DELETE FROM user_resources WHERE user_id IN (SELECT id FROM app_users WHERE auth_user_id = '${authUserId}');`,
  );
  wranglerSql(
    `DELETE FROM goals WHERE user_id IN (SELECT id FROM app_users WHERE auth_user_id = '${authUserId}');`,
  );
  wranglerSql(`DELETE FROM app_users WHERE auth_user_id = '${authUserId}';`);
  wranglerSql(`DELETE FROM user WHERE id = '${authUserId}';`);
}

async function main() {
  const existingId = await findAuthUserId();

  if (existingId && !reset) {
    const signIn = await authFetch("/api/auth/sign-in/email", {
      email: SMOKE.email,
      password: SMOKE.password,
    });
    if (signIn.ok || signIn.json?.user) {
      logReady("already exists");
      return;
    }
    console.log("Smoke user exists but password mismatch; re-run with --reset");
    process.exit(1);
  }

  if (existingId && reset) {
    console.log("Resetting smoke user…");
    deleteSmokeUser(existingId);
  }

  const signUp = await authFetch("/api/auth/sign-up/email", {
    email: SMOKE.email,
    password: SMOKE.password,
    name: SMOKE.name,
  });

  if (!signUp.ok && signUp.json?.code !== "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    console.error("Sign-up failed:", signUp.status, signUp.json);
    process.exit(1);
  }

  const signIn = await authFetch("/api/auth/sign-in/email", {
    email: SMOKE.email,
    password: SMOKE.password,
  });

  if (!signIn.ok && !signIn.json?.user) {
    console.error("Sign-in failed after sign-up:", signIn.status, signIn.json);
    process.exit(1);
  }

  logReady(reset ? "reset" : "created");
}

function logReady(note) {
  console.log(`Smoke account ${note}. Credentials: db/README.md`);
  console.log(`  Email:    ${SMOKE.email}`);
  console.log(`  Password: ${SMOKE.password}`);
  console.log(`  Sign in:  ${baseUrl}/sign-in`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
