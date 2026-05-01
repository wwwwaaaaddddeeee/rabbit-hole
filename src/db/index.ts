import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn?: ReturnType<typeof postgres>;
  db?: ReturnType<typeof drizzle>;
};

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForDb.conn) {
    globalForDb.conn = postgres(url, { max: 10, idle_timeout: 20, max_lifetime: 60 * 30 });
  }
  return globalForDb.conn;
}

export function getDb() {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getClient(), { schema });
  }
  return globalForDb.db;
}
