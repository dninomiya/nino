import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@workspace/db";
import { nanoid } from "nanoid";
import { nextCookies } from "better-auth/next-js";
import { getBaseURL } from "../lib/get-base-url.js";
import { anonymous } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => nanoid(10),
    },
  },
  plugins: [nextCookies(), anonymous()],
});
