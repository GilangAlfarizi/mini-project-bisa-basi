import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  id: varchar('_id').primaryKey().notNull(),
  name: varchar().notNull(),
});
