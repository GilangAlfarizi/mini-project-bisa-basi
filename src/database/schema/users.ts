import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  id: varchar().primaryKey().notNull(),
  name: varchar().notNull(),
  password: varchar().notNull(),
  email: varchar().notNull(),
});
