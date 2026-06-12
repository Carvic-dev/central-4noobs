import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let pool: Pool | undefined;
let db: NodePgDatabase<typeof schema> | undefined;

export function getDb() {
  if (db) {
    return db;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL nao foi configurada em .env.local");
  }

  const usesSupabase = connectionString.includes("supabase.co");

  pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    ssl: usesSupabase ? { rejectUnauthorized: false } : undefined,
  });
  db = drizzle(pool, { schema });

  return db;
}
