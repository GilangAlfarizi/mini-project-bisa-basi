import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
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
    email: varchar().notNull().unique(),
    isVerified: boolean('is_verified').default(false).notNull(),
    picUrl: text('pic_url'),
  },
  (table) => {
    return {
      nameIdx: index('users_name_idx').on(table.name),
      picUrlIdx: index('users_pic_url_idx').on(table.picUrl),
      emailIdx: uniqueIndex('users_email_idx').on(table.email),
    };
  },
);
