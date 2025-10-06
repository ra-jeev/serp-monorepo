import { pgTable, serial, timestamp, varchar, text } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  image: varchar('image', { length: 500 }),
  author: varchar('author', { length: 255 }),
  excerpt: text('excerpt'),
  featuredImage: varchar('featured_image', { length: 500 }),
  content: text('content'),
  videoId: varchar('video_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
