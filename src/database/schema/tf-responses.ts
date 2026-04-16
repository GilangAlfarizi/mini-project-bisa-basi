import { json, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tfResponses = pgTable('tf_responses', {
  syncedAt: timestamp('synced_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  submittedAt: timestamp('submitted_at', {
    withTimezone: true,
    mode: 'string',
  }),
  landedAt: timestamp('landed_at', { withTimezone: true, mode: 'string' }),
  id: varchar().primaryKey().notNull(),
  formId: varchar('form_id').notNull(),
  token: varchar().notNull(),
  landingId: varchar('landing_id'),
  responseType: varchar('response_type'),
  metadata: json(),
  hidden: json(),
  calculated: json(),
  variables: json(),
  outcome: json(),
  answers: json(),
  thankyouScreenRef: varchar('thankyou_screen_ref'),
});
