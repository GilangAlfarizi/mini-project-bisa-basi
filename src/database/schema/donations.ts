import { PaymentStatus } from '@domain/enums';
import { pgTable, real, timestamp, varchar } from 'drizzle-orm/pg-core';

export const donations = pgTable('donations', {
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  id: varchar('_id').primaryKey().notNull(),
  userId: varchar('user_id').notNull(),
  campaignId: varchar('campaign_id').notNull(),
  paymentType: varchar('payment_type').notNull(),
  amount: real().notNull(),
  status: varchar().$type<PaymentStatus>().notNull(),
});
