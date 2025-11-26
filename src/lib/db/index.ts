import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { ensurePerformanceIndexes } from './migrations';

let db: ReturnType<typeof drizzle> | null = null;
let indexesInitialized = false;

export const getDb = async () => {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
  }
  
  // Ensure performance indexes are created (runs once)
  if (!indexesInitialized) {
    indexesInitialized = true;
    // Run in background, don't block the request
    ensurePerformanceIndexes().catch(console.error);
  }
  
  return db;
};