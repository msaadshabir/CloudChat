# CloudChat

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern social platform inspired by X (Twitter), built with Next.js 15 for real-time interactions.

## Features

- User authentication with Clerk
- Create, like, retweet, and comment on posts
- User profiles with custom images and bio
- Real-time feed with search and activity notifications
- Content moderation with configurable banned words
- Admin tools for user and content management

## Tech Stack

**Frontend**

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React (icons)

**Backend & Database**

- Neon Postgres (serverless database)
- Drizzle ORM (type-safe SQL)
- Runtime schema migrations

**Authentication & Storage**

- Clerk (authentication, webhooks, user management)
- Vercel Blob (media storage)

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

## License

MIT
