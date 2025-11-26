# CloudChat

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?style=flat-square&logo=playwright)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern social platform inspired by X (Twitter), built with Next.js 15 for real-time interactions.

## Features

- User authentication with Clerk
- Create, like, retweet, and comment on posts
- User profiles with custom images and bio
- Real-time feed with SSE-based live updates
- Infinite scroll with cursor-based pagination
- Optimistic UI updates with automatic rollback
- Content moderation with configurable banned words
- Rate limiting on API endpoints
- Mobile-responsive design with bottom navigation
- SEO optimized with OpenGraph and Twitter cards
- Admin tools for user and content management

## Tech Stack

**Frontend**

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Lucide React (icons)
- SWR (client-side caching)

**Backend & Database**

- Neon Postgres (serverless database)
- Drizzle ORM (type-safe SQL)
- Runtime schema migrations with auto-indexing
- Zod (input validation)

**Authentication & Storage**

- Clerk (authentication, webhooks, user management)
- Vercel Blob (media storage)

**Testing**

- Vitest (unit testing)
- Playwright (E2E testing)
- Testing Library (React component testing)

**Additional Tools**

- date-fns (date formatting)
- Svix (webhook verification)

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cloudchat.git
cd cloudchat

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL=your_neon_postgres_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Vercel Blob (optional)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Moderation (optional)
BANNED_WORDS=word1,word2,word3
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    api/                  # API routes with rate limiting
    (routes)/             # Page routes with loading/error states
  components/             # React components
    InfiniteFeed.tsx      # Infinite scroll feed
    MobileNav.tsx         # Mobile bottom navigation
    TweetCard.tsx         # Tweet with optimistic updates
    TweetCardSkeleton.tsx # Loading skeletons
  lib/
    api/                  # API utilities (rate limiting, errors)
    db/                   # Database schema and migrations
    hooks/                # Custom React hooks (useRealtime, useSWR)
    validations/          # Zod validation schemas
e2e/                      # Playwright E2E tests
```

## Architecture

- **Server Components**: Used for initial data fetching and SEO
- **Client Components**: Used for interactivity and real-time updates
- **API Routes**: RESTful endpoints with Zod validation and rate limiting
- **Database**: Auto-migrating schema with performance indexes
- **Caching**: SWR for client-side, Next.js revalidation for server-side
- **Real-time**: Server-Sent Events for live tweet notifications

## License

MIT
