import { PaymentStatus } from '@domain/enums';
import { index, pgTable, real, timestamp, varchar } from 'drizzle-orm/pg-core';

import { campaigns } from './campaigns';
import { users } from './users';

export const donations = pgTable(
  'donations',
  {
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
    id: varchar().primaryKey().notNull(),
    userId: varchar('user_id')
      .notNull()
      .references(() => users.id),
    campaignId: varchar('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    paymentType: varchar('payment_type'),
    orderId: varchar('order_id'),
    midtransToken: varchar('midtrans_token'),
    amount: real().notNull(),
    status: varchar().$type<PaymentStatus>().notNull(),
  },
  (table) => {
    return {
      userIdx: index('donations_user_idx').on(table.userId),
      campaignIdx: index('donations_campaign_idx').on(table.campaignId),
    };
  },
);
