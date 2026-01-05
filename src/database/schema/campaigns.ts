import { pgTable, real, timestamp, varchar } from 'drizzle-orm/pg-core';

export const campaigns = pgTable('campaigns', {
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  id: varchar().primaryKey().notNull(),
  categoryId: varchar('category_id').notNull(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  thumbnail: varchar(),
  totalAmount: real('total_amount').notNull(),
});
