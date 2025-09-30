import { neon } from '@neondatabase/serverless';

let migrationsRan: Promise<void> | null = null;

export async function ensureUsersBioColumn() {
  if (!migrationsRan) {
    migrationsRan = (async () => {
      if (!process.env.DATABASE_URL) return;
      const sql = neon(process.env.DATABASE_URL);
      // Safe, idempotent DDL to add the column when missing
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio text`;
    })();
  }
  return migrationsRan;
}
