import Database from "better-sqlite3";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: new Database(":memory:"),
  emailAndPassword: {
    enabled: true,
  },
});
