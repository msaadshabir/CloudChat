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

export async function ensureRetweetsTable() {
  if (!migrationsRan) {
    migrationsRan = (async () => {
      if (!process.env.DATABASE_URL) return;
      const sql = neon(process.env.DATABASE_URL);
      await sql`CREATE TABLE IF NOT EXISTS retweets (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id text REFERENCES users(id) ON DELETE CASCADE,
        tweet_id uuid REFERENCES tweets(id) ON DELETE CASCADE,
        created_at timestamp DEFAULT now()
      )`;
      // Unique pair to prevent duplicates
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS retweets_user_tweet_unique ON retweets(user_id, tweet_id)`;
    })();
  }
  return migrationsRan;
}

export async function ensureLikesUniqueIndex() {
  if (!process.env.DATABASE_URL) return;
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS likes_user_tweet_unique ON likes(user_id, tweet_id)`;
}

export async function ensureRepliesTable() {
  if (!process.env.DATABASE_URL) return;
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS replies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tweet_id uuid REFERENCES tweets(id) ON DELETE CASCADE,
    user_id text REFERENCES users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp DEFAULT now()
  )`;
}
