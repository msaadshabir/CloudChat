# CloudChat

A lightweight, real-time platform inspired by X (Twitter) built on Next.js App Router with Clerk auth, Neon Postgres via Drizzle ORM, and Tailwind CSS. Create clouds, like, retweet, and comment—with moderation and admin tooling.

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
