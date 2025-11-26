import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { tweets, users } from '@/lib/db/schema';
import { desc, gt } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

// Store for active connections and their last known tweet timestamp
const connections = new Map<string, { controller: ReadableStreamDefaultController; lastCheck: Date }>();

// Check for new tweets periodically
async function checkForNewTweets(lastCheck: Date) {
  try {
    const db = await getDb();
    const newTweets = await db
      .select({
        id: tweets.id,
        content: tweets.content,
        createdAt: tweets.createdAt,
        author: {
          id: users.id,
          name: users.name,
          image: users.image,
          username: users.username
        }
      })
      .from(tweets)
      .leftJoin(users, eq(tweets.authorId, users.id))
      .where(gt(tweets.createdAt, lastCheck))
      .orderBy(desc(tweets.createdAt))
      .limit(10);
    
    return newTweets;
  } catch (error) {
    console.error('Error checking for new tweets:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const connectionId = crypto.randomUUID();
  
  const stream = new ReadableStream({
    start(controller) {
      connections.set(connectionId, { 
        controller, 
        lastCheck: new Date() 
      });

      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', connectionId })}\n\n`));

      // Set up polling interval (every 10 seconds)
      const interval = setInterval(async () => {
        const connection = connections.get(connectionId);
        if (!connection) {
          clearInterval(interval);
          return;
        }

        try {
          const newTweets = await checkForNewTweets(connection.lastCheck);
          
          if (newTweets.length > 0) {
            const message = JSON.stringify({ 
              type: 'new-tweets', 
              count: newTweets.length,
              tweets: newTweets.map(t => ({
                id: t.id,
                content: t.content,
                createdAt: t.createdAt,
                author: t.author
              }))
            });
            controller.enqueue(encoder.encode(`data: ${message}\n\n`));
            
            // Update last check time
            connection.lastCheck = new Date();
          }

          // Send heartbeat to keep connection alive
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`));
        } catch (error) {
          console.error('SSE polling error:', error);
        }
      }, 10000); // Check every 10 seconds

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        connections.delete(connectionId);
        try {
          controller.close();
        } catch {
          // Controller may already be closed
        }
      });
    },
    cancel() {
      connections.delete(connectionId);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for nginx
    },
  });
}
