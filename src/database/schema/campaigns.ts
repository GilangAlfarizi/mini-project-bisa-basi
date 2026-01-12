import {
  index,
  pgTable,
  real,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { categories } from './categories';

export const campaigns = pgTable(
  'campaigns',
  {
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
    id: varchar().primaryKey().notNull(),
    categoryId: varchar('category_id')
      .notNull()
      .references(() => categories.id),
    name: varchar().notNull(),
    description: varchar().notNull(),
    thumbnail: varchar(),
    thumbnailId: varchar('thumbnail_id').unique(),
    totalAmount: real('total_amount').notNull(),
  },
  (table) => {
    return {
      categoryIdx: index('campaigns_category_idx').on(table.categoryId),
      name: index('campaigns_name_idx').on(table.name),
      totalAmountIdx: index('campaigns_total_amount_idx').on(table.totalAmount),
      thumbnail: index('campaigns_thumbnail_idx').on(table.thumbnail),
      thumbnailId: uniqueIndex('campaigns_thumbnail_id_idx').on(
        table.thumbnailId,
      ),
    };
  },
);
