import { neon } from '@neondatabase/serverless';

let migrationsRan: Promise<void> | null = null;
let indexesCreated = false;

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

// Create performance indexes for common queries
export async function ensurePerformanceIndexes() {
  if (indexesCreated) return;
  if (!process.env.DATABASE_URL) return;
  
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    // Index on tweets.author_id for profile queries and joins
    await sql`CREATE INDEX IF NOT EXISTS idx_tweets_author_id ON tweets(author_id)`;
    
    // Index on tweets.created_at for feed ordering (descending)
    await sql`CREATE INDEX IF NOT EXISTS idx_tweets_created_at_desc ON tweets(created_at DESC)`;
    
    // Index on likes.tweet_id for counting likes per tweet
    await sql`CREATE INDEX IF NOT EXISTS idx_likes_tweet_id ON likes(tweet_id)`;
    
    // Index on likes.user_id for finding user's likes
    await sql`CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id)`;
    
    // Index on replies.tweet_id for counting replies per tweet
    await sql`CREATE INDEX IF NOT EXISTS idx_replies_tweet_id ON replies(tweet_id)`;
    
    // Index on retweets.tweet_id for counting retweets per tweet
    await sql`CREATE INDEX IF NOT EXISTS idx_retweets_tweet_id ON retweets(tweet_id)`;
    
    // Index on retweets.user_id for finding user's retweets
    await sql`CREATE INDEX IF NOT EXISTS idx_retweets_user_id ON retweets(user_id)`;
    
    // Index on users.username for search queries
    await sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`;
    
    // Index on users.created_at for user listing
    await sql`CREATE INDEX IF NOT EXISTS idx_users_created_at_desc ON users(created_at DESC)`;
    
    indexesCreated = true;
  } catch (error) {
    console.error('Failed to create performance indexes:', error);
  }
}
