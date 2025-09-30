# CloudChat

Vercel-themed microblogging app (X-like) built on Next.js App Router with Clerk auth, Neon Postgres via Drizzle ORM, and Tailwind CSS. Create clouds, like, retweet, and comment—with moderation and admin tooling.

## Features

- Clerk authentication (sign-in/sign-up) with protected routes; Home is public
- Create Cloud: post up to 280 chars
- Feed: author avatar/name/@handle, relative timestamps
- Interactions: like, retweet, and comment (inline)
- Search: list users and filter by query
- Activity: see likes given/received
- Profile: name/@handle, bio, profile image upload (compressed, Vercel Blob storage)
- Onboarding: collect display name and optional bio/picture; handle via Clerk
- Moderation: configurable banned words for posts/replies
- Admin: delete user or a specific cloud via API
- Production-safe: runtime migrations ensure required tables/columns/indexes exist

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4
- Clerk (auth, webhooks)
- Neon Postgres + Drizzle ORM
- Vercel Blob (profile media)
- Icons: lucide-react

## Getting Started

1. Prereqs

   - Node 18+
   - Neon Postgres database URL
   - Clerk app (Dev or Prod keys)

2. Env vars (`.env.local`)

   - DATABASE_URL=postgres://...
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   - CLERK_SECRET_KEY=...
   - Optional: CLERK_WEBHOOK_SECRET=... (to verify webhooks)
   - Optional: BANNED_WORDS=word1,word2,... (simple profanity list)

3. Install and run

   - npm install
   - npm run dev

4. Webhooks
   - Point Clerk user webhooks to /api/webhooks/clerk
   - With CLERK_WEBHOOK_SECRET set, signatures are verified using Svix

## Moderation

- Basic profanity guard using `src/lib/moderation.ts`
  - Reads comma-separated BANNED_WORDS
  - Normalizes text (diacritics, separators, common leetspeak) before matching
  - Enforced in:
    - POST /api/tweets (cloud creation)
    - POST /api/replies (comments)

## Admin Tools

- Delete user (dev utility): POST /api/admin/delete-user { userId }
- Delete cloud: POST /api/admin/delete-tweet { tweetId }
- Note: tighten access by checking an allowlist or role if exposing in prod

## Data Model

- users (bio optional)
- tweets (authorId -> users, ON DELETE CASCADE)
- likes (userId -> users, tweetId -> tweets, ON DELETE CASCADE)
- retweets (userId, tweetId unique; cascades)
- replies (tweetId -> tweets, userId -> users; cascades)

## Runtime Migrations

- `src/lib/db/migrations.ts` performs minimal, idempotent DDL at runtime:
  - Adds users.bio column if missing
  - Ensures retweets and replies tables exist
  - Ensures unique index on likes (user_id, tweet_id)

## Scripts

- dev: next dev --turbopack
- build: next build
- start: next start
- lint: eslint

## Notes

- Home remains public as requested; non-essential onboarding redirect is soft-gated
- Profile image uploads are compressed client-side and stored via Vercel Blob
- Clerk “Development mode” badge shows on live sites if using dev keys or domains; switch to production keys and matching domain to remove
