import { json, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tfForms = pgTable('tf_forms', {
  syncedAt: timestamp('synced_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }),
  id: varchar().primaryKey().notNull(),
  title: text(),
  data: json(),
});
