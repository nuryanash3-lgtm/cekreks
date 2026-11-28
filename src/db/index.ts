import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

const globalForDb = globalThis as unknown as {
  __cekreksPool?: Pool;
};

/**
 * Shared Neon serverless Pool singleton (reused across HMR in development).
 */
export const pool =
  globalForDb.__cekreksPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__cekreksPool = pool;
}

/**
 * Drizzle ORM instance backed by Neon serverless Pool (supports transactions).
 */
export const db = drizzle(pool, { schema });

export { schema };
export type Database = typeof db;
