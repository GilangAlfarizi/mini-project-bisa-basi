import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const campaigns = pgTable('campaigns', {
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  id: varchar('_id').primaryKey().notNull(),
  categoryId: varchar('category_id').notNull(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  thumbnail: varchar(),
});
