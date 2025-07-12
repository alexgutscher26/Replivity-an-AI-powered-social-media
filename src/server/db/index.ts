import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as auth from "./schema/auth-schema";
import * as billing from "./schema/billing-schema";
import * as generations from "./schema/generations-schema";
import * as hashtag from "./schema/hashtag-schema";
import * as post from "./schema/post-schema";
import * as products from "./schema/products-schema";
import * as settings from "./schema/settings-schema";
import * as usage from "./schema/usage-schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema: {
    ...post,
    ...auth,
    ...settings,
    ...products,
    ...billing,
    ...usage,
    ...generations,
    ...hashtag,
  },
});
