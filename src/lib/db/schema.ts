import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").unique(),
  name: text("name"),
  image: text("image"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tweets = pgTable("tweets", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  authorId: text("author_id").references(() => users.id, { onDelete: 'cascade' }),
  parentId: uuid("parent_id"), // .references(() => tweets.id), // Self-reference causing TS error
  createdAt: timestamp("created_at").defaultNow(),
});

export const likes = pgTable("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: 'cascade' }),
  tweetId: uuid("tweet_id").references(() => tweets.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const tweetsRelations = relations(tweets, ({ one, many }) => ({
  author: one(users, { fields: [tweets.authorId], references: [users.id] }),
  replies: many(tweets, { relationName: "replies" }),
  parent: one(tweets, { fields: [tweets.parentId], references: [tweets.id], relationName: "replies" }),
  likes: many(likes),
}));

export const usersRelations = relations(users, ({ many }) => ({
  tweets: many(tweets),
  likes: many(likes),
}));